import { useState, useEffect } from "react";
import api from "../services/api";
import { 
  BookOpenIcon, 
  UserIcon, 
  ArrowRightIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowPathIcon 
} from "@heroicons/react/24/outline";
import { formatDate } from "../lib/utils"; // Ensure this path is correct based on your folder structure

export default function IssueBook() {
  // --- STATE: Manual Issue ---
  const [books, setBooks] = useState([]);
  const [issue, setIssue] = useState({ rollNo: "", bookId: "" });
  const [issuing, setIssuing] = useState(false);
  const [manualSuccessMsg, setManualSuccessMsg] = useState("");

  // --- STATE: Pending Requests ---
  const [requests, setRequests] = useState([]);
  const [processingId, setProcessingId] = useState(null); // For button loading states

  const [loading, setLoading] = useState(true);

  // --- FETCH DATA (Both Books & Requests) ---
  const loadAllData = async () => {
    // Don't set global loading true on refresh, only initial load could use it if needed
    // But here we keep it simple.
    try {
      const [bookRes, reqRes] = await Promise.all([
        api.get("/book"),
        api.get("/issue/pending")
      ]);
      setBooks(bookRes.data || []);
      setRequests(reqRes.data || []);
    } catch (err) {
      console.error("Failed to load data", err);
      // Optional: alert("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- HANDLER: Manual Issue ---
  const handleManualIssue = async (e) => {
    e.preventDefault();
    setIssuing(true);
    setManualSuccessMsg("");
    try {
      await api.post(`/issue/confirm/roll/${encodeURIComponent(issue.rollNo)}/book/${issue.bookId}`);
      
      setManualSuccessMsg("Book issued successfully!");
      setIssue({ rollNo: "", bookId: "" }); 
      
      // Refresh data (stock counts might change)
      loadAllData();
    } catch (error) {
      const msg = error.response?.data || "Unknown error";
      alert("Failed: " + msg);
    } finally {
      setIssuing(false);
    }
  };

  // --- HANDLER: Approve Request ---
  const handleApprove = async (issueId) => {
    setProcessingId(issueId);
    try {
      await api.put(`/issue/approve/${issueId}`);
      // alert("Request Approved!"); // Optional: lessen alerts for better UX
      loadAllData(); // Refresh list to remove the item and update book copies
    } catch (err) {
      const msg = err.response?.data || "Approval Failed";
      alert("Error: " + msg);
    } finally {
      setProcessingId(null);
    }
  };

  // --- HANDLER: Reject Request ---
  const handleReject = async (issueId) => {
    if(!window.confirm("Reject this request?")) return;
    
    setProcessingId(issueId);
    try {
      await api.put(`/issue/reject/${issueId}`);
      loadAllData(); 
    } catch (err) {
      const msg = err.response?.data || "Rejection Failed";
      alert("Error: " + msg);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="flex justify-center p-10">Loading workspace...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-12 mb-20">
      
      {/* SECTION 1: MANUAL ISSUE FORM */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-indigo-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">Issue a Book</h1>
          <p className="text-indigo-100 text-sm mt-1">Manually assign a book to a student</p>
        </div>

        <div className="p-8">
          {manualSuccessMsg && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center gap-2">
              <span className="text-xl">🎉</span> {manualSuccessMsg}
            </div>
          )}

          <form onSubmit={handleManualIssue} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Student Roll Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. 54 or NIT/2024/..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={issue.rollNo} 
                  onChange={(e) => setIssue({ ...issue, rollNo: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Book</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpenIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white appearance-none"
                  value={issue.bookId}
                  onChange={(e) => setIssue({ ...issue, bookId: e.target.value })}
                  required
                >
                  <option value="">Choose a book...</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bookName} (Copies: {b.copies ?? 0})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={issuing}
              className="md:col-span-2 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {issuing ? "Processing..." : (
                <>Issue Book Directly <ArrowRightIcon className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* SECTION 2: PENDING REQUESTS DASHBOARD */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
             <h2 className="text-2xl font-bold text-gray-900">Pending Requests</h2>
             <p className="text-gray-500 text-sm">Approve or reject student requests</p>
          </div>
          <button 
             onClick={loadAllData} 
             className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-lg transition"
          >
             <ArrowPathIcon className="w-4 h-4" /> Refresh List
          </button>
        </div>

        {requests.length === 0 ? (
            <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">No pending requests at the moment.</p>
            </div>
        ) : (
            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{req.book?.bookName}</div>
                        <div className="text-xs text-gray-500">By {req.book?.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{req.student?.name}</div>
                        <div className="text-xs text-gray-500">Roll: {req.student?.rollNo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(req.requestDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                        <button 
                            onClick={() => handleApprove(req.id)}
                            disabled={processingId !== null}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full transition ${
                                processingId === req.id 
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                            }`}
                        >
                            <CheckCircleIcon className="w-4 h-4" /> 
                            {processingId === req.id ? "Saving..." : "Approve"}
                        </button>
                        
                        <button 
                            onClick={() => handleReject(req.id)}
                            disabled={processingId !== null}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full transition ${
                                processingId === req.id 
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                        >
                            <XCircleIcon className="w-4 h-4" /> 
                            {processingId === req.id ? "..." : "Reject"}
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
}