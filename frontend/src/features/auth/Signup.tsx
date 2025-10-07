import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { setCredentials } from "./authSlice";
import { useDispatch } from "react-redux";
import { scheduleTokenExpiryWatcher } from "../../api/axiosInstance";
import authApis from "../../api/authApis";

type RoleType = "Employee" | "Manager" | "Admin";

interface SignupFormInputs {
  username: string;
  password: string;
  roles: RoleType[];
  active: boolean;
}

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    defaultValues: { roles: ["Employee"], active: true },
  });

  const { mutate, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: (data: SignupFormInputs) => authApis.signup(data),
    onSuccess: (response) => {
      if (!response.httpStatusOk) return;
      dispatch(
        setCredentials({
          accessToken: response.accessToken,
        })
      );
      scheduleTokenExpiryWatcher(response.expiresIn);
      navigate("/dash");
    },
  });

  const onSubmit = (data: SignupFormInputs) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-indigo-600">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Role
            </label>
            <select
              {...register("roles", { required: "Please select a role" })}
              multiple
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold <kbd>Ctrl</kbd> (or <kbd>Cmd</kbd> on Mac) to select
              multiple.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("active")}
              id="active"
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="active" className="text-gray-700">
              Active Account
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isPending ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {isError && (
          <p className="text-red-500 text-sm text-center mt-4">
            {error instanceof Error ? error.message : "Signup failed"}
          </p>
        )}

        {isSuccess && (
          <p className="text-green-600 text-sm text-center mt-4">
            Account created successfully! Redirecting to login...
          </p>
        )}

        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
