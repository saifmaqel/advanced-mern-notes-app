import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Welcome = () => {
  const { username, isManager, isAdmin } = useAuth();

  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);

  return (
    <section className="flex flex-col items-center mt-30 bg-gray-50 text-center px-6">
      <h1 className="text-3xl font-bold  text-gray-800">Welcome {username}!</h1>
      <p className="text-sm text-gray-500 mb-8">{today}</p>
      <div className="space-y-4">
        <Link
          to="/dash/notes"
          className="block w-48 mx-auto px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          View techNotes
        </Link>

        {(isManager || isAdmin) && (
          <Link
            to="/dash/users"
            className="block w-48 mx-auto px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            View User Settings
          </Link>
        )}
      </div>
    </section>
  );
};

export default Welcome;
