import { useState, useEffect } from "react";
import api from "../services/api";
import { BookOpenIcon, UserIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function IssueBook() {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [issue, setIssue] = useState({ studentId: "", bookId: "" });
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [sRes, bRes] = await Promise.all([api.get("/student"), api.get("/book")]);
        setStudents(sRes.data || []);
        setBooks(bRes.data || []);
      } catch (err) {
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    setIssuing(true);
    setSuccessMsg("");
    try {
      await api.post(`/issue/student/${issue.studentId}/book/${issue.bookId}`);
      setSuccessMsg("Book issued successfully!");
      setIssue({ studentId: "", bookId: "" });
      // Refresh books to update availability if needed
      const bRes = await api.get("/book");
      setBooks(bRes.data || []);
    } catch (error) {
      alert("Failed: " + (error.response?.data?.message || "Unknown error"));
    } finally {
      setIssuing(false);
    }
  };

  if (loading) return <div className="flex justify-center p-10">Loading resources...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-indigo-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">Issue a Book</h1>
          <p className="text-indigo-100 text-sm mt-1">Assign a book to a registered student</p>
        </div>

        <div className="p-8">
          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center gap-2">
              <span className="text-xl">🎉</span> {successMsg}
            </div>
          )}

          <form onSubmit={handleIssue} className="space-y-6">
            {/* Student Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Student</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white appearance-none"
                  value={issue.studentId}
                  onChange={(e) => setIssue({ ...issue, studentId: e.target.value })}
                  required
                >
                  <option value="">Choose a student...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Book Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Book</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpenIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white appearance-none"
                  value={issue.bookId}
                  onChange={(e) => setIssue({ ...issue, bookId: e.target.value })}
                  required
                >
                  <option value="">Choose a book...</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>{b.bookName} (Author: {b.author})</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={issuing}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {issuing ? "Processing..." : (
                <>Issue Book <ArrowRightIcon className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}