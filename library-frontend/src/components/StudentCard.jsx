import React, { useState } from "react";
import PropTypes from "prop-types";

export default function StudentCard({ student, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const yes = window.confirm(`Delete student ${student.name}?`);
    if (!yes) return;
    try {
      setLoading(true);
      await onDelete(student.id);
    } catch (err) {
      alert("Delete failed: " + (err?.message || "unknown"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-100 hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-indigo-700">{student.name}</h3>
      <p className="text-gray-600">
        <a href={`mailto:${student.email}`} className="hover:underline">{student.email}</a>
      </p>
      <div className="mt-3 flex justify-end">
        <button
          onClick={handleDelete}
          disabled={loading}
          className={`text-sm px-3 py-1 rounded-md transition ${loading ? "bg-red-300 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"}`}
          aria-label={`Delete ${student.name}`}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}

StudentCard.propTypes = {
  student: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};
