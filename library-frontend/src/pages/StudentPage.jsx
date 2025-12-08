import { useState, useEffect } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import StudentCard from "../components/StudentCard";
import { UserPlusIcon } from "@heroicons/react/24/outline";

export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "" });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/student");
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setAdding(true);
    try {
      const res = await api.post("/student", form);
      if (res.data && res.data.id) {
        setStudents((prev) => [res.data, ...prev]);
      } else {
        await fetchStudents();
      }
      setForm({ name: "", email: "" });
    } catch (err) {
      alert("Failed to add student");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await api.delete(`/student/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students Directory</h1>
          <p className="text-gray-500 mt-1">Manage registered students</p>
        </div>
      </div>

      {/* Add Student Form */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Register New Student</h3>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Full Name"
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <button
            disabled={adding}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 shadow-md shadow-indigo-200"
          >
            {adding ? "Saving..." : <><UserPlusIcon className="w-5 h-5" /> Register</>}
          </button>
        </form>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} onDelete={handleDeleteStudent} />
        ))}
      </div>
    </div>
  );
}