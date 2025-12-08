import React, { useState } from "react";
import PropTypes from "prop-types";
import { TrashIcon } from "@heroicons/react/24/outline";
import { formatDate } from "../lib/utils";

/**
 * props:
 *  - book: { id, bookName, author, createdAt }
 *  - onDelete: async function(bookId) => Promise
 */
export default function BookCard({ book, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const yes = window.confirm(`Delete "${book.bookName}" by ${book.author}?`);
    if (!yes) return;
    try {
      setLoading(true);
      await onDelete(book.id);
      // parent should remove it from list; we just show loading state
    } catch (err) {
      // show friendly error — you can replace with toast
      alert("Delete failed: " + (err?.message || "unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <article
      className="bg-white shadow-sm rounded-xl p-4 border border-gray-100 hover:shadow-md transition"
      role="article"
      aria-labelledby={`book-${book.id}-title`}
    >
      <h3 id={`book-${book.id}-title`} className="text-lg font-semibold text-indigo-700">
        {book.bookName || "Untitled"}
      </h3>
      <p className="text-gray-600">Author: {book.author || "Unknown"}</p>
      {book.createdAt && <p className="text-xs text-gray-400">Added: {formatDate(book.createdAt)}</p>}
      <div className="mt-3 flex justify-end">
        <button
          onClick={handleDelete}
          disabled={loading}
          aria-label={`Delete ${book.bookName}`}
          className={`text-sm px-3 py-1 rounded-md transition ${
            loading
              ? "bg-red-300 text-white cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {loading ? "Deleting..." : (
            <span className="flex items-center gap-2">
              <TrashIcon className="w-4 h-4" />
              Delete
            </span>
          )}
        </button>
      </div>
    </article>
  );
}

BookCard.propTypes = {
  book: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};
