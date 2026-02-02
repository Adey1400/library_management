import React, { useState } from "react";
import PropTypes from "prop-types";
import api from "../services/api"; 
import toast from "react-hot-toast";

import { 
  TrashIcon, 
  BookOpenIcon, 
  UserIcon, 
  CalendarIcon, 
  HandRaisedIcon,
  PencilSquareIcon,
  CheckIcon,       
  XMarkIcon
} from "@heroicons/react/24/outline";
import { formatDate } from "../lib/utils";

export default function BookCard({ book, onDelete , onUpdate}) {
  const [deleting, setDeleting] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm , setEditForm]= useState({
    bookName: book.bookName,
    author: book.author
  }
  
  )
  const role = localStorage.getItem("role");
 
  const handleDelete = async () => {
    if (!window.confirm(`Delete "${book.bookName}"?`)) return;
    setDeleting(true);
    try {
      await onDelete(book.id);
      toast.success("Book deleted");
    } catch (err) {
      toast.error("Failed: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

 
const handleUpdate = async () => {
    try {
      await api.put(`/book/${book.id}`, editForm);
     if(onUpdate){
      onUpdate(book.id, editForm);
      toast.success("Book updated!");
     }
     setIsEditing(false)
    } catch (err) {
      toast.error("Update failed: " + (err.response?.data || err.message));
    }
  };

const handleRequest = async () => {
   
    const myRollNo = localStorage.getItem("rollNo"); 

    if (!myRollNo) {
        toast.error("Roll Number not found. Please log in again.");
        return;
    }

    try {
        // 🟢 encodeURIComponent is crucial! It turns "/" into "%2F" so the URL doesn't break
        await api.post(`/issue/request/book/${book.id}?rollNo=${encodeURIComponent(myRollNo)}`);
        
        toast.success("Request sent successfully!");
    } catch (err) {
        toast.error(err.response?.data || "Request failed");
    }
};

  return (
  <article className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div>
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <BookOpenIcon className="h-6 w-6" />
        </div>

        {/* --- EDIT MODE: INPUTS --- */}
        {isEditing ? (
          <div className="space-y-2">
            <input 
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-bold text-gray-900"
              value={editForm.bookName}
              onChange={(e) => setEditForm({...editForm, bookName: e.target.value})}
            />
            <input 
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-600"
              value={editForm.author}
              onChange={(e) => setEditForm({...editForm, author: e.target.value})}
            />
          </div>
        ) : (
          /* --- VIEW MODE: TEXT --- */
          <>
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
          </>
        )}
      </div>

      <div className="mt-5 border-t border-gray-100 pt-4 flex justify-between items-center gap-2">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${book.isIssued ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
          {book.isIssued ? "Busy" : "Available"}
        </span>
        
        <div className="flex gap-2">
          {/* STUDENT: Request Button */}
          {!book.isIssued && (role !== "LIBRARIAN" && role !== "Librarian") && (
            <button
              onClick={handleRequest}
              disabled={requesting}
              className="text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg"
              title="Request this book"
            >
              {requesting ? "..." : <HandRaisedIcon className="h-4 w-4" />}
            </button>
          )}

          {/* LIBRARIAN ACTIONS */}
          {(role === "LIBRARIAN" || role === "Librarian") && (
            <>
              {isEditing ? (
                // Save & Cancel Buttons
                <>
                  <button onClick={handleUpdate} className="text-green-600 hover:bg-green-50 px-2 py-1 rounded">
                    <CheckIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:bg-gray-100 px-2 py-1 rounded">
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </>
              ) : (
                // Edit & Delete Buttons
                <>
                  <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:bg-blue-50 px-2 py-1 rounded">
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                  <button onClick={handleDelete} disabled={deleting} className="text-red-500 hover:bg-red-50 px-2 py-1 rounded">
                    {deleting ? "..." : <TrashIcon className="h-4 w-4" />}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}

BookCard.propTypes = {
  book: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
};