import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";


export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileAndHistory();
  }, []);

  const fetchProfileAndHistory = async () => {
    setLoading(true);
    try {
   
      const profileRes = await api.get("/student/profile");
      const studentData = profileRes.data;
      setProfile(studentData);

      if (studentData && studentData.id) {
        const historyRes = await api.get(`/issue/student/${studentData.id}`);
        setHistory(historyRes.data || []);
      }
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
   
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start">
        {/* Avatar Area */}
        <div className="flex-shrink-0">
          <div className="h-24 w-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
            {profile?.name ? profile.name[0].toUpperCase() : "U"}
          </div>
        </div>

        {/* Details Area */}
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div className="col-span-1 md:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900">{profile?.name || "Student"}</h1>
            <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wide">
              Student Account
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500 font-medium">Email Address</p>
            <p className="text-gray-900 font-medium">{profile?.email || "N/A"}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500 font-medium">Roll Number</p>
            <p className="text-gray-900 font-medium">{profile?.rollNo || "N/A"}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500 font-medium">Department</p>
            <p className="text-gray-900 font-medium">{profile?.department || "N/A"}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500 font-medium">Joined Date</p>
            <p className="text-gray-900 font-medium">{profile?.joinedDate || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* HISTORY SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2">Borrowing History</h2>
        
        {history.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
             <p className="text-gray-500">No books borrowed yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {history.map((record) => (
              <div key={record.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-800">{record.book?.bookName}</h3>
                    <p className="text-sm text-gray-500">Author: {record.book?.author}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      record.status === 'ISSUED' ? 'bg-green-100 text-green-700' :
                      record.status === 'REQUESTED' ? 'bg-yellow-100 text-yellow-700' :
                      record.status === 'RETURNED' ? 'bg-gray-200 text-gray-600' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {record.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {record.status === 'ISSUED' ? `Due: ${record.dueDate}` : `Req: ${record.requestDate}`}
                    </p>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}