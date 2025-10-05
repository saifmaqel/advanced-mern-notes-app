import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../features/auth/authSlice"; // adjust path
import authApis from "../api/authApis"; // assumes you have logout API endpoint

const DashHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { mutate: logoutUser, isPending } = useMutation({
    mutationFn: async () => {
      return await authApis.logout();
    },
    onSuccess: (data) => {
      if (!data.httpStatusOk) return;
      queryClient.clear();
      dispatch(logout());
      navigate("/login");
    },
    onError: (err) => {
      console.error("Logout failed", err);
    },
  });

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/dash" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            techNotes
          </h1>
        </Link>

        {/* <div className="flex flex-col sm:flex items-center space-x-1 text-gray-700 text-sm">
          <p>Jane Doe</p>
        </div> */}

        <div className="flex items-center space-x-2">
          <button
            onClick={() => logoutUser()}
            disabled={isPending}
            className={`ml-4 px-4 py-2 rounded-lg shadow text-white transition ${
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
