import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Sending Login Data:", form);
      const res = await api.post("/login", form);
      console.log("🟢 Server Response:", res.data);

      if (res.data && res.data.token) {
          console.log("✅ Token found! Saving to storage...");
          
          // Save standard auth data
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("role", res.data.role);
          localStorage.setItem("name", res.data.name);
          
          // 🟢 NEW: Save Roll Number if available (For Students)
          if (res.data.rollNo) {
              console.log("🎓 Saving Roll No:", res.data.rollNo);
              localStorage.setItem("rollNo", res.data.rollNo);
          } else {
              // Clear it if logging in as Librarian/Admin so we don't use old data
              localStorage.removeItem("rollNo");
          }
          
          // Dispatch event so other components (like Navbar) update immediately
          window.dispatchEvent(new Event("storage"));
          
          navigate("/books"); 
      } else {
          console.error("❌ Response missing token:", res.data);
          alert("Login successful but no token received!");
      }
    } catch (err) {
      console.error("Login Error Details:", err);
      const msg = err.response?.data?.error || "Invalid credentials";
      alert("Login Failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <span className="text-4xl">📚</span>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your library
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="you@example.com"
                onChange={(e) => setForm({ ...form, email: e.target.value.trim() })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={form.password}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
                onChange={(e) => setForm({ ...form, password: e.target.value.trim() })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}