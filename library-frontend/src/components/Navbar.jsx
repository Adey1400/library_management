import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left: Brand */}
        <Link
          to="/"
          className="text-2xl font-semibold text-indigo-600 tracking-wide hover:text-indigo-700 transition-colors"
        >
          📚 LibraryHub
        </Link>

        {/* Center: Links */}
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-indigo-600 ${
                isActive ? "text-indigo-600 underline" : ""
              }`
            }
          >
            Books
          </NavLink>

          <NavLink
            to="/students"
            className={({ isActive }) =>
              `hover:text-indigo-600 ${
                isActive ? "text-indigo-600 underline" : ""
              }`
            }
          >
            Students
          </NavLink>

          <NavLink
            to="/issues"
            className={({ isActive }) =>
              `hover:text-indigo-600 ${
                isActive ? "text-indigo-600 underline" : ""
              }`
            }
          >
            Issue Book
          </NavLink>
        </div>

        {/* Right: Profile or placeholder */}
        <div className="hidden md:flex items-center space-x-3">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
            Login
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden flex justify-center space-x-6 py-2 border-t text-gray-700 bg-gray-50">
        <NavLink to="/" className="hover:text-indigo-600">
          Books
        </NavLink>
        <NavLink to="/students" className="hover:text-indigo-600">
          Students
        </NavLink>
        <NavLink to="/issues" className="hover:text-indigo-600">
          Issue
        </NavLink>
      </div>
    </nav>
  );
}
