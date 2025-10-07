import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAllowed: boolean;
  children: React.ReactNode;
}

export default function ProtectedRoute({
  isAllowed,
  children,
}: ProtectedRouteProps) {
  const navigate = useNavigate();

  if (!isAllowed) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-gray-50 text-gray-800">
        <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
        <p className="mb-6 text-gray-600 text-center">
          You are not allowed to access this page. Please contact your
          administrator if you believe this is a mistake.
        </p>
        <button
          onClick={() => navigate("/dash")}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
