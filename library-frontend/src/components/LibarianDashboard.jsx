import { useState, useEffect } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { formatDate } from "../lib/utils";

export default function LibrarianDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Pending Requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Matches your backend: @GetMapping("/pending")
      const res = await api.get("/issue/pending");
      setRequests(res.data || []);
    } catch (err) {
      alert("Failed to fetch requests: " + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 2. Handle Approve
  const handleApprove = async (issueId) => {
    try {
      // Matches backend: @PutMapping("/approve/{issueId}")
      await api.put(`/issue/approve/${issueId}`);
      alert("Request Approved! Book is now Issued.");
      fetchRequests(); // Refresh list
    } catch (err) {
      alert("Approval Failed");
    }
  };

  // 3. Handle Reject
  const handleReject = async (issueId) => {
    if(!window.confirm("Reject this request?")) return;
    try {
      await api.put(`/issue/reject/${issueId}`);
      fetchRequests(); // Refresh list
    } catch (err) {
      alert("Rejection Failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Librarian Dashboard</h1>
          <p className="text-gray-500">Manage pending book requests</p>
        </div>
        <button onClick={fetchRequests} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800">
            <ArrowPathIcon className="w-5 h-5" /> Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No pending requests at the moment.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{req.book?.bookName || "Unknown Book"}</div>
                    <div className="text-xs text-gray-500">Author: {req.book?.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{req.student?.name || "Unknown Student"}</div>
                    <div className="text-xs text-gray-500">{req.student?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(req.requestDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                    <button 
                        onClick={() => handleApprove(req.id)}
                        className="text-green-600 hover:text-green-900 flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full transition"
                    >
                        <CheckCircleIcon className="w-4 h-4" /> Approve
                    </button>
                    <button 
                        onClick={() => handleReject(req.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full transition"
                    >
                        <XCircleIcon className="w-4 h-4" /> Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}