import { useState, useEffect } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { 
  BookOpenIcon, 
  UserIcon, 
  ArrowRightIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowPathIcon,
  ClockIcon,
  ArchiveBoxArrowDownIcon
} from "@heroicons/react/24/outline";
import { formatDate } from "../lib/utils"; 

export default function IssueBook() {

  const [activeTab, setActiveTab] = useState("issue"); 
  

  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);


  const [issue, setIssue] = useState({ rollNo: "", bookId: "" });
  const [issuing, setIssuing] = useState(false);
  const [manualSuccessMsg, setManualSuccessMsg] = useState("");


  const loadAllData = async () => {
    setLoading(true);
    try {

      const [bookRes, reqRes, historyRes] = await Promise.all([
        api.get("/book"),
        api.get("/issue/pending"),
        api.get("/issue/all") 
      ]);

      setBooks(bookRes.data || []);
      setRequests(reqRes.data || []);
      
      const allTransactions = historyRes.data || [];
      const currentlyIssued = allTransactions.filter(item => item.status === "ISSUED");
      setActiveLoans(currentlyIssued);

    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleManualIssue = async (e) => {
    e.preventDefault();
    setIssuing(true);
    setManualSuccessMsg("");
    try {
      await api.post(`/issue/confirm/roll/${encodeURIComponent(issue.rollNo)}/book/${issue.bookId}`);
      setManualSuccessMsg("Book issued successfully!");
      setIssue({ rollNo: "", bookId: "" }); 
      loadAllData();
    } catch (error) {
      alert("Failed: " + (error.response?.data || "Unknown error"));
    } finally {
      setIssuing(false);
    }
  };


  const handleApprove = async (issueId) => {
    setProcessingId(issueId);
    try {
      await api.put(`/issue/approve/${issueId}`);
      loadAllData();
    } catch (err) {
      alert("Error: " + (err.response?.data || "Approval Failed"));
    } finally {
      setProcessingId(null);
    }
  };


  const handleReject = async (issueId) => {
    if(!window.confirm("Reject this request?")) return;
    setProcessingId(issueId);
    try {
      await api.put(`/issue/reject/${issueId}`);
      loadAllData(); 
    } catch (err) {
      alert("Error: " + (err.response?.data || "Rejection Failed"));
    } finally {
      setProcessingId(null);
    }
  };


  const handleReturn = async (issueId) => {
    if(!window.confirm("Mark this book as Returned?")) return;
    setProcessingId(issueId);
    try {
        await api.put(`/issue/return/${issueId}`);
        alert("Book Returned Successfully!");
        loadAllData(); 
    } catch (err) {
        alert("Return Failed: " + (err.response?.data || "Server Error"));
    } finally {
        setProcessingId(null);
    }
  };

  if (loading && books.length === 0) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto mt-6 mb-20 space-y-6">
      

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Circulation Desk</h1>
            <p className="text-gray-500 text-sm">Manage issues, requests, and returns</p>
        </div>
        
        {/* 🟢 TABS SWITCHER */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
                onClick={() => setActiveTab("issue")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === "issue" ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
            >
                Issue Book
            </button>
            <button 
                onClick={() => setActiveTab("pending")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === "pending" ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
            >
                Requests ({requests.length})
            </button>
            <button 
                onClick={() => setActiveTab("returns")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === "returns" ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
            >
                Returns ({activeLoans.length})
            </button>
        </div>
      </div>

      {activeTab === "issue" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
            <div className="bg-indigo-600 px-8 py-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpenIcon className="w-6 h-6"/> Manual Issue
            </h2>
            <p className="text-indigo-100 text-sm mt-1">Assign a book directly to a student via Roll No</p>
            </div>

            <div className="p-8">
            {manualSuccessMsg && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5"/> {manualSuccessMsg}
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
                    placeholder="e.g. 2024001"
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
                className="md:col-span-2 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-70"
                >
                {issuing ? "Processing..." : ( <>Issue Book <ArrowRightIcon className="w-5 h-5" /></> )}
                </button>
            </form>
            </div>
        </div>
      )}


      {activeTab === "pending" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Student Requests</h3>
                <button onClick={loadAllData} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-full"><ArrowPathIcon className="w-5 h-5"/></button>
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No pending requests found.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {requests.map((req) => (
                        <div key={req.id} className="flex flex-col sm:flex-row justify-between items-center p-4 border rounded-lg hover:shadow-md transition bg-white">
                            <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full"><ClockIcon className="w-6 h-6"/></div>
                                <div>
                                    <p className="font-bold text-gray-900">{req.book?.bookName}</p>
                                    <p className="text-sm text-gray-500">{req.student?.name} • Roll: {req.student?.rollNo}</p>
                                    <p className="text-xs text-gray-400 mt-1">Requested: {formatDate(req.requestDate)}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleApprove(req.id)} disabled={processingId === req.id} className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium text-sm transition flex items-center gap-1">
                                    <CheckCircleIcon className="w-4 h-4" /> Approve
                                </button>
                                <button onClick={() => handleReject(req.id)} disabled={processingId === req.id} className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium text-sm transition flex items-center gap-1">
                                    <XCircleIcon className="w-4 h-4" /> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}


      {activeTab === "returns" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Active Issued Books</h3>
                <button onClick={loadAllData} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-full"><ArrowPathIcon className="w-5 h-5"/></button>
            </div>

            {activeLoans.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No books are currently issued.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {activeLoans.map((loan) => (
                        <div key={loan.id} className="flex flex-col sm:flex-row justify-between items-center p-4 border border-indigo-100 bg-indigo-50/30 rounded-lg hover:bg-white hover:shadow-md transition">
                            <div className="flex gap-4 items-center mb-3 sm:mb-0">
                                <div className="hidden sm:flex p-3 bg-white border border-indigo-100 text-indigo-600 rounded-lg"><BookOpenIcon className="w-6 h-6"/></div>
                                <div>
                                    <p className="font-bold text-gray-900">{loan.book?.bookName}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                        <UserIcon className="w-3 h-3"/> <span>{loan.student?.name}</span>
                                        <span className="text-gray-300">|</span>
                                        <span>{loan.student?.rollNo}</span>
                                    </div>
                                    <p className="text-xs text-orange-600 flex items-center gap-1 mt-1 font-medium">
                                        <ClockIcon className="w-3 h-3"/> Due: {formatDate(loan.dueDate)}
                                    </p>
                                </div>
                            </div>
                            

                            <button 
                                onClick={() => handleReturn(loan.id)}
                                disabled={processingId === loan.id}
                                className="w-full sm:w-auto px-5 py-2.5 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-600 hover:text-white transition shadow-sm flex items-center justify-center gap-2"
                            >
                                <ArchiveBoxArrowDownIcon className="w-4 h-4" />
                                {processingId === loan.id ? "Processing..." : "Return Book"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}

    </div>
  );
}