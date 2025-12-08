import { useEffect, useState } from "react";
import api from "../api/axios";
import BookCard from "../components/BookCard";
import Loader from "../components/Loader";

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
    setError(null);
    try {
      const res = await api.get("/book");
      setBooks(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
    if (!form.bookName.trim()) return alert("Book name required");
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.post("/book", form);
      // Prefer to use server response if it returns created resource:
      // If backend doesn't return created entity, refetch:
      if (res.data && res.data.id) {
        setBooks(prev => [res.data, ...prev]);
      } else {
        await fetchBooks();
      }
      setForm({ bookName: "", author: "" });
    } catch (err) {
      console.error(err);
      alert("Add failed: " + (err.message || "unknown"));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteBook = async (id) => {
    const yes = window.confirm("Delete this book?");
    if (!yes) return;
    try {
      await api.delete(`/book/${id}`);
      // remove from UI
      setBooks(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed: " + (err.message || "unknown"));
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-indigo-700">📚 All Books</h1>

      {error && (
        <div className="mb-4 text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={addBook}
        className="flex gap-3 mb-6 bg-white p-4 rounded-xl shadow-sm"
      >
        <input
          type="text"
          placeholder="Book name"
          value={form.bookName}
          onChange={(e) => setForm({ ...form, bookName: e.target.value })}
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <input
          type="text"
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <button
          disabled={submitting}
          className={`px-4 rounded-lg text-white ${submitting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {submitting ? "Adding..." : "Add"}
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        {books.map((b) => (
          <BookCard key={b.id} book={b} onDelete={deleteBook} />
        ))}
      </div>
    </div>
  );
}
