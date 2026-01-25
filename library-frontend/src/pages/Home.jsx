import { Link } from "react-router-dom";
import { BookOpenIcon, ShieldCheckIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default function Home() {
  // Check if token exists to determine state
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-700 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          📚 University Library Portal
        </h1>
        <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
          Manage books, track students, and handle issues efficiently.
          Please log in to access the dashboard.
        </p>
        
        {/* 🟢 CONDITIONAL RENDERING */}
        {isLoggedIn ? (
          <div className="flex justify-center">
            <Link 
              to="/books" 
              className="px-8 py-3 bg-white text-indigo-700 font-bold rounded-lg hover:bg-gray-100 transition shadow-lg flex items-center gap-2"
            >
              Go to Dashboard <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        ) : (
          <div className="flex justify-center gap-4">
            <Link 
              to="/login" 
              className="px-8 py-3 bg-white text-indigo-700 font-bold rounded-lg hover:bg-gray-100 transition shadow-lg"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-indigo-600 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Rules & Guidelines Section */}
      <div className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Library Guidelines & Rules
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Rule 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <BookOpenIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Book Handling</h3>
            <p className="text-gray-600">
              Handle all books with care. Any damage or scribbling will result in a fine equivalent to the book's price.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheckIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Return Policy</h3>
            <p className="text-gray-600">
              Books must be returned within 14 days. Late returns attract a penalty of $1 per day.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Silence Zone</h3>
            <p className="text-gray-600">
              Maintain absolute silence in the reading hall. Group discussions are only allowed in designated rooms.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p>© 2025 Library Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}