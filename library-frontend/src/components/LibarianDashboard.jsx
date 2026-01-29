import { useState, useEffect } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowPathIcon,
  BookOpenIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { formatDate } from "../lib/utils";

export default function LibrarianDashboard() {
  const [requests, setRequests] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("pending"); 


  const fetchData = async () => {
    setLoading(true);
    try {
      if (view === "pending") {
        const res = await api.get("/issue/pending");
        setRequests(res.data || []);
      } else {
        const res = await api.get("/issue/active"); 
        setActiveLoans(res.data || []);
      }
    } catch (err) {
      alert("Failed to fetch data: " + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]); 


  const handleApprove = async (issueId) => {
    try {
      await api.put(`/issue/approve/${issueId}`);
      fetchData(); 
    } catch (err) {
      alert("Approval Failed");
    }
  };

  const handleReject = async (issueId) => {
    if(!window.confirm("Reject this request?")) return;
    try {
      await api.put(`/issue/reject/${issueId}`);
      fetchData(); 
    } catch (err) {
      alert("Rejection Failed");
    }
  };

  // 🟢 NEW: Return Book Action
  const handleReturn = async (issueId) => {
    if(!window.confirm("Mark this book as Returned?")) return;
    try {
      await api.put(`/issue/return/${issueId}`);
      alert("Book Returned Successfully!");
      fetchData();
    } catch (err) {
      alert("Return Failed: " + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Librarian Dashboard</h1>
          <p className="text-gray-500">Manage library operations</p>
        </div>
        

        <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
                onClick={() => setView("pending")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${view === "pending" ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
            >
                Pending Requests
            </button>
            <button 
                onClick={() => setView("active")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${view === "active" ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
            >
                Active Loans (Return)
            </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={fetchData} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            <ArrowPathIcon className="w-4 h-4" /> Refresh List
        </button>
      </div>

      {loading ? <Loader /> : (
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {view === "pending" ? "Request Date" : "Due Date"}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(view === "pending" ? requests : activeLoans).length === 0 ? (
                <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                        No {view === "pending" ? "pending requests" : "active loans"} found.
                    </td>
                </tr>
              ) : (
                (view === "pending" ? requests : activeLoans).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <BookOpenIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-900">{item.book?.bookName}</div>
                            <div className="text-xs text-gray-500">{item.book?.author}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{item.student?.name}</div>
                    <div className="text-xs text-gray-500">{item.student?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {view === "pending" ? (
                        formatDate(item.requestDate)
                    ) : (
                        <span className="flex items-center gap-1 text-orange-600 font-medium">
                            <ClockIcon className="w-4 h-4" /> {formatDate(item.dueDate)}
                        </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {view === "pending" ? (
                        <div className="flex justify-end gap-2">
                            <button onClick={() => handleApprove(item.id)} className="text-green-600 hover:bg-green-50 p-2 rounded-full" title="Approve">
                                <CheckCircleIcon className="w-6 h-6" />
                            </button>
                            <button onClick={() => handleReject(item.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-full" title="Reject">
                                <XCircleIcon className="w-6 h-6" />
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => handleReturn(item.id)}
                            className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-700 transition shadow-sm"
                        >
                            Return Book
                        </button>
                    )}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}