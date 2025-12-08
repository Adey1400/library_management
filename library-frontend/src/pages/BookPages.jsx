import { useEffect, useState } from "react";
import api from "../services/api";
import BookCard from "../components/BookCard";
import Loader from "../components/Loader";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function BookPages() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ bookName: "", author: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/book");
      setBooks(res.data || []);
    } catch (err) {
      setError("Unable to load library data.");
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
    if (!form.bookName.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post("/book", form);
      // Optimistic UI update or fetch
      if (res.data && res.data.id) {
        setBooks((prev) => [res.data, ...prev]);
      } else {
        await fetchBooks();
      }
      setForm({ bookName: "", author: "" });
    } catch (err) {
      alert("Failed to add book");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await api.delete(`/book/${id}`);
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library Books</h1>
          <p className="text-gray-500 mt-1">Manage your collection and availability</p>
        </div>
      </div>

      {/* Add Book Form */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={addBook} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter Book Title..."
              value={form.bookName}
              onChange={(e) => setForm({ ...form, bookName: e.target.value })}
              className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              required
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Author Name"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              required
            />
          </div>
          <button
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
          >
            {submitting ? (
              "Adding..."
            ) : (
              <>
                <PlusIcon className="w-5 h-5" /> Add Book
              </>
            )}
          </button>
        </form>
      </div>

      {/* Content Grid */}
      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">{error}</div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No books found</h3>
          <p className="text-gray-500">Start by adding a new book above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((b) => (
            <BookCard key={b.id} book={b} onDelete={handleDeleteBook} />
          ))}
        </div>
      )}
    </div>
  );
}