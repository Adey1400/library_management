import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  UserIcon,
  BookOpenIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function Register() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    department: "",
    rollNo: "",
    currentYear: "",
    semester: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    localStorage.clear();

    const payload = {
      ...form,
      role: selectedRole,
    };

    try {

      const res = await api.post("/register", payload);

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("name", res.data.name);

        if (res.data.rollNo) {
          localStorage.setItem("rollNo", res.data.rollNo);
        }


        window.dispatchEvent(new Event("storage"));

        alert("Registration Successful!");
        navigate("/books");
      } else {
        alert("Registration Successful! Please Login.");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message;
      alert(`Registration Failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });


  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Join LibraryHub
        </h1>
        <p className="text-gray-500 mb-10">
          Choose your account type to continue
        </p>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
          <button
            onClick={() => setSelectedRole("STUDENT")}
            className="flex flex-col items-center p-8 bg-white rounded-2xl border-2 border-transparent hover:border-indigo-600 hover:shadow-xl transition-all group cursor-pointer"
          >
            <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <UserIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Student</h3>
            <p className="text-gray-500 text-center mt-2 text-sm">
              Borrow books, view history, and request issues.
            </p>
          </button>

          <button
            onClick={() => setSelectedRole("LIBRARIAN")}
            className="flex flex-col items-center p-8 bg-white rounded-2xl border-2 border-transparent hover:border-purple-600 hover:shadow-xl transition-all group cursor-pointer"
          >
            <div className="h-16 w-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <BookOpenIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Librarian</h3>
            <p className="text-gray-500 text-center mt-2 text-sm">
              Manage inventory, approve requests, and returns.
            </p>
          </button>
        </div>

        <div className="mt-8">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-indigo-600"
          >
            Already have an account?{" "}
            <span className="font-semibold">Login</span>
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative">
        <button
          onClick={() => setSelectedRole(null)}
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-700 flex items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {selectedRole === "STUDENT"
              ? "Student Registration"
              : "Librarian Access"}
          </h2>
          <p className="mt-2 text-gray-500">Please fill in your details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                First Name
              </label>
              <input
                name="firstname"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Last Name
              </label>
              <input
                name="lastname"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>


          {selectedRole === "STUDENT" && (
            <div className="pt-4 border-t border-gray-100 mt-4 animate-fade-in space-y-4">
              <h4 className="text-sm font-semibold text-indigo-700 mb-2">
                Academic Details
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Department
                  </label>
                  <input
                    name="department"
                    placeholder="e.g. CS"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Roll Number
                  </label>
                  <input
                    name="rollNo"
                    placeholder="e.g. 2025001"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Current Year
                  </label>
                  <select
                    name="currentYear"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Semester
                  </label>
                  <select
                    name="semester"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Select Sem</option>

                    <option value="1st Semester">1st Semester</option>

                    <option value="2nd Semester">2nd Semester</option>

                    <option value="3rd Semester">3rd Semester</option>

                    <option value="4th Semester">4th Semester</option>

                    <option value="5th Semester">5th Semester</option>

                    <option value="6th Semester">6th Semester</option>

                    <option value="7th Semester">7th Semester</option>

                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-70 mt-6 cursor-pointer"
          >
            {loading ? "Creating Account..." : `Register as ${selectedRole}`}
          </button>
        </form>
      </div>
    </div>
  );
}
