import React from "react";
import PropTypes from "prop-types";
import { formatDate } from "../lib/utils";

export default function IssueCard({ issue }) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-100 hover:shadow-md transition">
      <h3 className="font-semibold text-indigo-700">{issue.bookName || "Unknown book"}</h3>
      <p className="text-gray-600">Issued to: {issue.studentName || "Unknown"}</p>
      <p className="text-sm text-gray-500">Issued: {formatDate(issue.issueDate)}</p>
      {issue.dueDate && <p className="text-sm text-gray-500">Due: {formatDate(issue.dueDate)}</p>}
      <div className="mt-2">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${issue.returned ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"}`}>
          {issue.returned ? "Returned" : "Issued"}
        </span>
      </div>
    </div>
  );
}

IssueCard.propTypes = {
  issue: PropTypes.object.isRequired,
};
