import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../features/auth/authSlice";
import authApis from "../api/authApis";
import useAuth from "../hooks/useAuth";

const DashHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { username, status } = useAuth();

  const { mutate: logoutUser, isPending } = useMutation({
    mutationFn: async () => await authApis.logout(),
    onSuccess: (data) => {
      if (!data.httpStatusOk) return;
      queryClient.clear();
      dispatch(logout());
      navigate("/login");
    },
    onError: (err) => console.error("Logout failed", err),
  });

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 py-3">
        <Link
          to="/dash"
          className="flex items-center justify-center text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <h1 className="text-xl sm:text-2xl font-bold whitespace-nowrap">
            techNotes
          </h1>
        </Link>
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-5 w-full sm:w-auto min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5 text-sm sm:text-base min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 flex-nowrap min-w-0">
              <span className="font-medium text-gray-700 whitespace-nowrap">
                Username:
              </span>
              <span
                title={username}
                className="text-blue-600 font-medium truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px]"
              >
                {username || "Guest"}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-nowrap min-w-0">
              <span className="font-medium text-gray-700 whitespace-nowrap">
                Role:
              </span>
              <span
                className={`capitalize truncate max-w-[120px] sm:max-w-[160px] ${
                  status === "Admin"
                    ? "text-red-600"
                    : status === "Manager"
                    ? "text-purple-600"
                    : "text-green-600"
                }`}
              >
                {status || "Unknown"}
              </span>
            </div>
          </div>
          <button
            onClick={() => logoutUser()}
            disabled={isPending}
            className={`whitespace-nowrap px-4 py-2 rounded-lg shadow text-white text-sm font-medium transition-all duration-200 ${
              isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashHeader;
