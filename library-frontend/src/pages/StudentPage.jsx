import { useState, useEffect } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";

export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStudent, setNewStudent] = useState({ name: "", email: "" });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/student");
        setStudents(res.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAdd = async () => {
    if (!newStudent.name.trim() || !newStudent.email.trim()) {
      alert("name and email required");
      return;
    }
    setAdding(true);
    try {
      const res = await api.post("/student", newStudent);
      // if backend returns saved entity, use it; otherwise refetch
      if (res.data && res.data.id) {
        setStudents(prev => [res.data, ...prev]);
      } else {
        const all = await api.get("/student");
        setStudents(all.data || []);
      }
      setNewStudent({ name: "", email: "" });
    } catch (err) {
      console.error(err);
      alert("Add failed: " + (err.message || ""));
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Students</h1>

      <div className="flex justify-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={newStudent.email}
          onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
        />
        <button
          className={`bg-blue-600 text-white px-4 py-2 rounded ${adding ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"}`}
          onClick={handleAdd}
          disabled={adding}
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div key={student.id} className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold">{student.name}</h2>
            <p className="text-gray-600">{student.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
