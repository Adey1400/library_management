import React from "react";
import PropTypes from "prop-types";
import { formatDate } from "../lib/utils";
import { ClockIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";

export default function IssueCard({ issue }) {
  const isReturned = issue.returned;
  
  return (
    <div className="relative flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      

      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{issue.bookName}</h3>
          <p className="text-sm text-gray-500">Issued to <span className="font-medium text-gray-700">{issue.studentName}</span></p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isReturned
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {isReturned ? (
            <>
              <CheckCircleIcon className="h-3.5 w-3.5" /> Returned
            </>
          ) : (
            <>
              <ClockIcon className="h-3.5 w-3.5" /> Active
            </>
          )}
        </span>
      </div>


      <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-3">
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Issued On</p>
          <p className="text-sm font-medium text-gray-900">{formatDate(issue.issueDate)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Due Date</p>
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-gray-900">
              {issue.dueDate ? formatDate(issue.dueDate) : "N/A"}
            </p>
         
            {!isReturned && issue.dueDate && (
              <ExclamationCircleIcon className="h-4 w-4 text-amber-500" title="Pending" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

IssueCard.propTypes = {
  issue: PropTypes.object.isRequired,
};