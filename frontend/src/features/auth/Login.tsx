import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import authApis from "../../api/authApis";
import { Link, useNavigate } from "react-router-dom";
import { scheduleTokenExpiryWatcher } from "../../api/axiosInstance";
import { useEffect } from "react";
import { store } from "../../store/store";
import toast from "react-hot-toast";

interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { errors } = formState;

  const { mutate, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: async (data: LoginFormValues) => await authApis.login(data),
    onSuccess: (data) => {
      if (!data.httpStatusOk) return;
      dispatch(
        setCredentials({
          accessToken: data.accessToken,
        })
      );
      scheduleTokenExpiryWatcher(data.expiresIn);
      navigate("/dash");
    },
    onError: (error) => {
      console.error("Login failed", error);
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    mutate(values);
  };

  useEffect(() => {
    if (store.getState().auth.token) {
      toast("You are already logged in");
      setTimeout(() => {
        navigate("/dash");
      }, 1000);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Username"
              {...register("username", { required: "Username is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        {isError && (
          <p className="text-red-500 text-sm text-center mt-4">
            {error instanceof Error
              ? error.message
              : "Invalid username or password"}
          </p>
        )}

        {isSuccess && (
          <p className="text-green-600 text-sm text-center mt-4">
            Logged in successfully!
          </p>
        )}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
