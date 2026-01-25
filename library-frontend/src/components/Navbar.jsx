import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { 
  BookOpenIcon, 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon 
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // 🟢 1. GET USER INFO
  const role = localStorage.getItem("role"); // "STUDENT" or "LIBRARIAN"
  const name = localStorage.getItem("name");

  // 🟢 2. LOGOUT LOGIC
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear(); // Wipe token, role, name
      navigate("/"); // Redirect to Home
    }
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-indigo-50 text-indigo-700 shadow-sm"
        : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-indigo-200 shadow-lg transition-transform group-hover:scale-105">
            <BookOpenIcon className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
            LibraryHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {/* Everyone sees Books */}
          <NavLink to="/books" className={navLinkClass}>Books</NavLink>
          
          {/* 🟢 LIBRARIAN ONLY LINKS */}
          {role === "LIBRARIAN" && (
            <>
              <NavLink to="/students" className={navLinkClass}>Students</NavLink>
              <NavLink to="/issues" className={navLinkClass}>Approvals</NavLink>
            </>
          )}

          {/* 🟢 STUDENT ONLY LINKS */}
          {role === "STUDENT" && (
            <NavLink to="/profile" className={navLinkClass}>My Profile</NavLink>
          )}
        </div>

        {/* Right Side: Profile & Logout */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-full border border-gray-200">
            <UserCircleIcon className="h-5 w-5 text-indigo-600" />
            <span className="capitalize">{name || "User"} ({role})</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
            title="Logout"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        >
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 shadow-lg space-y-2">
          <NavLink to="/books" className={navLinkClass} onClick={() => setIsOpen(false)}>Books</NavLink>
          
          {role === "LIBRARIAN" && (
            <>
              <NavLink to="/students" className={navLinkClass} onClick={() => setIsOpen(false)}>Students</NavLink>
              <NavLink to="/issues" className={navLinkClass} onClick={() => setIsOpen(false)}>Approvals</NavLink>
            </>
          )}
           
          {role === "STUDENT" && (
            <NavLink to="/profile" className={navLinkClass} onClick={() => setIsOpen(false)}>My Profile</NavLink>
          )}

          <div className="border-t border-gray-100 mt-2 pt-2">
             <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 font-medium">
               Logout
             </button>
          </div>
        </div>
      )}
    </nav>
  );
}