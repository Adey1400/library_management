import { useState, useEffect } from "react";
import api from "../api/axios";

export default function IssueBook() {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [issue, setIssue] = useState({ studentId: "", bookId: "" });
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [sRes, bRes] = await Promise.all([api.get("/student"), api.get("/book")]);
        setStudents(sRes.data || []);
        setBooks(bRes.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load students or books: " + (err.message || ""));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleIssue = async () => {
    if (!issue.studentId || !issue.bookId) {
      alert("Please select both student and book");
      return;
    }
    setIssuing(true);
    try {
      await api.post(`/issue/student/${issue.studentId}/book/${issue.bookId}`);
      alert("📘 Book issued successfully!");
      // optionally refresh lists
      const bRes = await api.get("/book");
      setBooks(bRes.data || []);
      setIssue({ studentId: "", bookId: "" });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to issue book: " + (error.message || error.response?.data || ""));
    } finally {
      setIssuing(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Issue a Book</h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <select
          className="border p-2 rounded"
          value={issue.studentId}
          onChange={(e) => setIssue({ ...issue, studentId: e.target.value })}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={issue.bookId}
          onChange={(e) => setIssue({ ...issue, bookId: e.target.value })}
        >
          <option value="">Select Book</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.bookName}
            </option>
          ))}
        </select>

        <button
          disabled={!issue.studentId || !issue.bookId || issuing}
          onClick={handleIssue}
          className={`px-4 py-2 rounded text-white ${(!issue.studentId || !issue.bookId || issuing) ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
        >
          {issuing ? "Issuing..." : "Issue Book"}
        </button>
      </div>
    </div>
  );
}
