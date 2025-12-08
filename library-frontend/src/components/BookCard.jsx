import React, { useState } from "react";
import PropTypes from "prop-types";
import api from "../services/api"; 
import { 
  TrashIcon, 
  BookOpenIcon, 
  UserIcon, 
  CalendarIcon, 
  HandRaisedIcon 
} from "@heroicons/react/24/outline";
import { formatDate } from "../lib/utils";

export default function BookCard({ book, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [requesting, setRequesting] = useState(false);

 
  const handleDelete = async () => {
    if (!window.confirm(`Delete "${book.bookName}"?`)) return;
    setDeleting(true);
    try {
      await onDelete(book.id);
    } catch (err) {
      alert("Failed: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

 
  const handleRequest = async () => {
    const studentId = prompt("Enter your Student ID to request this book:");
    if (!studentId) return;

    setRequesting(true);
    try {
      await api.post(`/issue/request/student/${studentId}/book/${book.id}`);
      alert("Request sent! Waiting for Librarian approval.");
    } catch (err) {
      alert("Request failed: " + (err.response?.data || err.message));
    } finally {
      setRequesting(false);
    }
  };

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div>
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <BookOpenIcon className="h-6 w-6" />
        </div>

        <h3 className="line-clamp-2 text-lg font-bold text-gray-900" title={book.bookName}>
          {book.bookName || "Untitled Book"}
        </h3>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UserIcon className="h-4 w-4 text-gray-400" />
            <span className="line-clamp-1">{book.author || "Unknown Author"}</span>
          </div>
          
          {book.createdAt && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
              <span>Added {formatDate(book.createdAt)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 border-t border-gray-100 pt-4 flex justify-between items-center gap-2">
        
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${book.isIssued ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
          {book.isIssued ? "Busy" : "Available"}
        </span>
        
        <div className="flex gap-2">
          {!book.isIssued && (
            <button
              onClick={handleRequest}
              disabled={requesting}
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              title="Request this book"
            >
              {requesting ? "..." : <HandRaisedIcon className="h-4 w-4" />}
            </button>
          )}

          
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            title="Delete this book"
          >
            {deleting ? (
              <span className="animate-pulse">...</span>
            ) : (
              <TrashIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

BookCard.propTypes = {
  book: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};