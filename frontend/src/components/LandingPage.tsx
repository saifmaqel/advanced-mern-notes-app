import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Welcome to <span className="text-indigo-600">TechNotes </span>
        </h1>

        <p className="text-gray-600 mb-6">
          Located in Beautiful city Amman, Tech Notes App provides a Users,
          Notes management.
        </p>

        <address className="not-italic leading-relaxed text-gray-700 mb-6">
          TechNotes App
          <br />
          Al-rabia
          <br />
          Amman, Jordan 12345
          <br />
        </address>

        <p className="text-gray-500 mb-6">Owner: Saif Aqel</p>

        <Link
          to="/login"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
