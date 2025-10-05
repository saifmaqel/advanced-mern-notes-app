// import axios from "axios";
import { api } from "./axiosInstance";
import type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  LogoutResponse,
} from "./types";

const resourceAuth = "auth";

// POST /auth
async function login(data: LoginRequest): Promise<LoginResponse> {
  const url = `/${resourceAuth}`;
  const body = data;
  const fetched = await api.post(url, body, {
    withCredentials: true, // important for cookies (refresh token)
  });
  return fetched.data;
}

// GET /auth/refresh
async function refresh(): Promise<RefreshResponse> {
  const url = `/${resourceAuth}/refresh`;
  const fetched = await api.get(url, {
    withCredentials: true,
  });
  return fetched.data;
}

// POST /auth/logout
async function logout(): Promise<LogoutResponse> {
  const url = `/${resourceAuth}/logout`;
  const fetched = await api.post(
    url,
    {},
    {
      withCredentials: true,
    }
  );
  return fetched.data;
}

const authApis = {
  login,
  refresh,
  logout,
};

export default authApis;
