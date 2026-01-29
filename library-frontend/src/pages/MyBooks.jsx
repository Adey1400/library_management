import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { formatDate } from "../lib/utils";
import { BookOpenIcon, ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";

export default function MyBooks() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const rollNo = localStorage.getItem("rollNo");

  useEffect(() => {
    if (!rollNo) {
      alert("Roll Number missing. Please login again.");
      return;
    }
    fetchMyBooks();
  }, [rollNo]);

  const fetchMyBooks = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/issue/my-history?rollNo=${encodeURIComponent(rollNo)}`);
      setIssues(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load your books.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ISSUED": return "bg-green-100 text-green-700 border-green-200";
      case "REQUESTED": return "bg-amber-100 text-amber-700 border-amber-200";
      case "RETURNED": return "bg-gray-100 text-gray-600 border-gray-200";
      case "REJECTED": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-500";
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Books History</h1>
        <p className="text-sm text-gray-500">Track your requests, active loans, and returns.</p>
      </div>

      <div className="space-y-4">
        {issues.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <BookOpenIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">You haven't borrowed any books yet.</p>
          </div>
        ) : (
          issues.map((issue) => (
            <div key={issue.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between gap-4 hover:shadow-md transition">
              

              <div className="flex gap-4">
                <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <BookOpenIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{issue.book?.bookName || "Unknown Book"}</h3>
                  <p className="text-sm text-gray-500">{issue.book?.author}</p>
                  
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className={`px-2 py-1 rounded-full border text-xs font-semibold ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                    
                    {issue.status === "ISSUED" && issue.dueDate && (
                      <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                        <ClockIcon className="w-3 h-3" /> Due: {formatDate(issue.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>


              <div className="text-sm text-gray-500 flex flex-col gap-1 sm:text-right min-w-[140px]">
                <div className="flex items-center gap-2 sm:justify-end">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span>Req: {formatDate(issue.requestDate)}</span>
                </div>
                {issue.issueDate && (
                  <div className="flex items-center gap-2 sm:justify-end text-green-700">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Issued: {formatDate(issue.issueDate)}</span>
                  </div>
                )}
                {issue.returnDate && (
                  <div className="flex items-center gap-2 sm:justify-end text-gray-400">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Ret: {formatDate(issue.returnDate)}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}