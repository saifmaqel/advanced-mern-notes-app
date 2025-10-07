import axios from "axios";
import { store } from "../store/store";
import toast from "react-hot-toast";
import { logout, setCredentials } from "../features/auth/authSlice";
import authApis from "./authApis";
import { queryClient } from "../main";

let tokenExpiryTimeout: NodeJS.Timeout | null = null;

export function scheduleTokenExpiryWatcher(expiresIn: number) {
  if (tokenExpiryTimeout) clearTimeout(tokenExpiryTimeout);

  const timeUntilExpiry = expiresIn * 1000;

  if (timeUntilExpiry <= 0) {
    queryClient.invalidateQueries();
    return;
  }

  tokenExpiryTimeout = setTimeout(() => {
    queryClient.invalidateQueries();
  }, timeUntilExpiry);
}

export const api = axios.create({
  baseURL: "https://technotes.onrender.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

api.interceptors.response.use(
  (response) => {
    if (typeof response.data === "object") {
      response.data.httpStatus = response.status;
      response.data.httpStatusOk =
        response.status >= 200 && response.status < 300;
    }

    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth")
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = authApis
          .refresh()
          .then((response) => {
            store.dispatch(
              setCredentials({
                accessToken: response.accessToken,
              })
            );
            scheduleTokenExpiryWatcher(response.expiresIn);
            return response.accessToken;
          })
          .catch(() => {
            store.dispatch(logout());
            toast.error("Session expired. Redirecting to login...");
            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);

            return Promise.reject(new Error("Unauthorized"));
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        originalRequest._retry = true;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    if (status === 403) {
      toast.error("Access denied.");
      store.dispatch(logout());
      if (location.pathname !== "/login") {
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
      return Promise.reject(new Error("Forbidden"));
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    if (!originalRequest.url.includes("/auth")) {
      toast.error(message);
    }

    return Promise.reject(new Error(message));
  }
);
