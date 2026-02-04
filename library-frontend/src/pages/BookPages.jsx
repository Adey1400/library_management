import { useEffect, useState } from "react";
import api from "../services/api";
import BookCard from "../components/BookCard";
import Loader from "../components/Loader";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function BookPages() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ bookName: "", author: "" });
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchBooks();
  }, []);

  // 🟢 FIX: Added 'query' parameter so search works
  const fetchBooks = async (query = "") => {
    setLoading(true);
    try {
      // If query is empty, it fetches all. If not, it searches.
      const res = await api.get(`/book?search=${query}`);
      setBooks(res.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to load books";
      setError(`Error: ${msg}`);
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
      // Optimistic update or refetch
      await fetchBooks(search);
      setForm({ bookName: "", author: "" });
      toast.success("Book Added Successfully");
    } catch (err) {
      toast.error("Failed to add book");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(search);
  };

  // Pass this to BookCard to handle deletions from parent state
  const handleDeleteBook = async (id) => {
    try {
      await api.delete(`/book/${id}`);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Delete failed: " + err.message);
    }
  };

  const handleBookUpdate = (id, updatedData) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id ? { ...book, ...updatedData } : book,
      ),
    );
  };

  if (loading && !books.length) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* --- TOP SECTION: SEARCH & TITLE --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Library Books</h1>
          <p className="text-sm text-gray-500">Explore our collection</p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-16 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                fetchBooks("");
              }}
              className="absolute right-3 top-2.5 text-xs text-gray-500 hover:text-indigo-600 font-medium px-2"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* --- MIDDLE SECTION: ADD BOOK FORM (LIBRARIAN ONLY) --- */}
      {(role === "LIBRARIAN" ||
        role === "Libarian" ||
        role === "Librarian") && (
        <div className="bg-white p-6 rounded-xl border border-indigo-100">
          <h2 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
            Add New Book
          </h2>
          <form onSubmit={addBook} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Book Name"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.bookName}
              onChange={(e) => setForm({ ...form, bookName: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Author Name"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-70 transition-colors"
            >
              {submitting ? "Adding..." : "Add Book"}
            </button>
          </form>
        </div>
      )}

      {/* --- BOTTOM SECTION: BOOK GRID --- */}
      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length > 0
          ? books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onDelete={handleDeleteBook} 
                onUpdate={handleBookUpdate}
              />
            ))
          : !loading && (
              <div className="col-span-full text-center py-20 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-lg">No books found matching "{search}"</p>
                <button
                  onClick={() => {
                    setSearch("");
                    fetchBooks("");
                  }}
                  className="mt-2 text-indigo-600 font-medium hover:underline"
                >
                  Clear Search
                </button>
              </div>
            )}
      </div>
    </div>
  );
}
