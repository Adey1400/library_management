import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BookOpenIcon, Bars3Icon, XMarkIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
          <NavLink to="/books" className={navLinkClass}>Books</NavLink>
          <NavLink to="/students" className={navLinkClass}>Students</NavLink>
          <NavLink to="/issues" className={navLinkClass}>Issue Book</NavLink>
        </div>

        {/* Right Side: Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition">
            <UserCircleIcon className="h-5 w-5" />
            <span>Admin</span>
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
          <NavLink to="/" className={navLinkClass} onClick={() => setIsOpen(false)}>Books</NavLink>
          <NavLink to="/students" className={navLinkClass} onClick={() => setIsOpen(false)}>Students</NavLink>
          <NavLink to="/issues" className={navLinkClass} onClick={() => setIsOpen(false)}>Issue Book</NavLink>
        </div>
      )}
    </nav>
  );
}