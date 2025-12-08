import React, { useState } from "react";
import PropTypes from "prop-types";
import { TrashIcon, AcademicCapIcon, EnvelopeIcon, IdentificationIcon } from "@heroicons/react/24/outline";

export default function StudentCard({ student, onDelete }) {
  const [loading, setLoading] = useState(false);

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to remove ${student.name}?`)) return;
    try {
      setLoading(true);
      await onDelete(student.id);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg hover:border-indigo-100">
      <div className="flex items-start justify-between gap-4">
        
        {/* Avatar & Info */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-md">
            {getInitials(student.name)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{student.name}</h3>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
              <AcademicCapIcon className="h-4 w-4" />
              <span>{student.department || "General"}</span>
              <span className="text-gray-300">•</span>
              <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                {student.rollNo || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Delete Action */}
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
          title="Delete Student"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-3">
        <a 
          href={`mailto:${student.email}`} 
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <EnvelopeIcon className="h-4 w-4" />
          {student.email}
        </a>
      </div>
    </div>
  );
}

StudentCard.propTypes = {
  student: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};