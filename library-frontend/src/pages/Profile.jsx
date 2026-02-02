import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { 
  AcademicCapIcon, 
  BuildingLibraryIcon, 
  IdentificationIcon, 
  BookOpenIcon,
  CheckBadgeIcon,
  ClockIcon,
  PencilSquareIcon, // 🟢 New Icon
  CheckIcon,        // 🟢 New Icon
  XMarkIcon         // 🟢 New Icon
} from "@heroicons/react/24/outline";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, returned: 0 });
  const [loading, setLoading] = useState(true);

  // 🟢 Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchProfileAndStats();
  }, []);

  const fetchProfileAndStats = async () => {
    setLoading(true);
    try {
      const profileRes = await api.get("/student/profile");
      const studentData = profileRes.data;
      setProfile(studentData);
      setEditForm(studentData); // 🟢 Initialize form with current data

      if (studentData && studentData.id) {
        const historyRes = await api.get(`/issue/student/${studentData.id}`);
        const history = historyRes.data || [];
        
        setStats({
            total: history.length,
            active: history.filter(h => h.status === 'ISSUED').length,
            returned: history.filter(h => h.status === 'RETURNED').length
        });
      }
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Handle Update Action
  const handleUpdate = async () => {
    try {
        const payload = {
            name: editForm.name,
            department: editForm.department,
            currentYear: editForm.currentYear,
            semester: editForm.semester
        };

        // Call the new backend endpoint
        await api.put(`/student/${profile.id}`, payload);
        
        // Update UI locally
        setProfile({ ...profile, ...payload });
        setIsEditing(false);
        toast.success("Profile Updated Successfully!");
    } catch (err) {
        toast.error("Update Failed: " + (err.response?.data || "Server Error"));
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
   

      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-6 relative">
        
        
        <div className="absolute top-4 right-4">
            {isEditing ? (
                <div className="flex gap-2">
                    <button onClick={handleUpdate} className="bg-green-100 text-green-700 hover:bg-green-200 p-2 rounded-full transition" title="Save Changes">
                        <CheckIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => { setIsEditing(false); setEditForm(profile); }} className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-2 rounded-full transition" title="Cancel">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <button onClick={() => setIsEditing(true)} className="bg-gray-50 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 p-2 rounded-full transition" title="Edit Profile">
                    <PencilSquareIcon className="w-5 h-5" />
                </button>
            )}
        </div>

        <div className="h-24 w-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
            {profile?.name ? profile.name[0].toUpperCase() : "U"}
        </div>
        
        <div className="text-center md:text-left w-full">
       
            {isEditing ? (
                <input 
                    className="text-3xl font-bold text-gray-900 border-b-2 border-indigo-200 focus:border-indigo-500 outline-none bg-transparent w-full md:w-auto px-1"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                />
            ) : (
                <h1 className="text-3xl font-bold text-gray-900">{profile?.name}</h1>
            )}

            <p className="text-gray-500 mt-1">{profile?.email}</p>
            
            <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200">
                    ID: {profile?.rollNo}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200">
                    Member since {profile?.joinedDate}
                </span>
            </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><BookOpenIcon className="w-6 h-6" /></div>
            <div><p className="text-sm text-gray-500">Total Requests</p><p className="text-2xl font-bold text-gray-900">{stats.total}</p></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><ClockIcon className="w-6 h-6" /></div>
            <div><p className="text-sm text-gray-500">Currently Issued</p><p className="text-2xl font-bold text-gray-900">{stats.active}</p></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckBadgeIcon className="w-6 h-6" /></div>
            <div><p className="text-sm text-gray-500">Books Returned</p><p className="text-2xl font-bold text-gray-900">{stats.returned}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <AcademicCapIcon className="w-5 h-5 text-gray-500" /> Academic Information
            </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            
            
            <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</label>
                <div className="flex items-center gap-2 text-gray-900 font-medium h-9">
                    <BuildingLibraryIcon className="w-5 h-5 text-gray-400" />
                    {isEditing ? (
                        <input 
                            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full" 
                            value={editForm.department} 
                            onChange={(e) => setEditForm({...editForm, department: e.target.value})} 
                        />
                    ) : ( profile?.department || "Not Set" )}
                </div>
            </div>

            
            <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Roll Number</label>
                <div className="flex items-center gap-2 text-gray-900 font-medium h-9">
                    <IdentificationIcon className="w-5 h-5 text-gray-400" />
                    <span className="opacity-70">{profile?.rollNo || "Not Set"}</span>
                </div>
            </div>

           
            <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Year</label>
                <div className="h-9 flex items-center">
                    {isEditing ? (
                        <select 
                            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full bg-white"
                            value={editForm.currentYear} 
                            onChange={(e) => setEditForm({...editForm, currentYear: e.target.value})}
                        >
                            <option value="">Select Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                        </select>
                    ) : ( 
                        <p className="text-gray-900 font-medium">{profile?.currentYear || "N/A"}</p> 
                    )}
                </div>
            </div>


            <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Semester</label>
                <div className="h-9 flex items-center">
                    {isEditing ? (
                        <select 
                            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full bg-white"
                            value={editForm.semester} 
                            onChange={(e) => setEditForm({...editForm, semester: e.target.value})}
                        >
                            <option value="">Select Sem</option>
                            {[1,2,3,4,5,6,7,8].map(n => (
                                <option key={n} value={`${n}th Sem`}>{n}th Sem</option>
                            ))}
                        </select>
                    ) : ( 
                        <p className="text-gray-900 font-medium">{profile?.semester || "N/A"}</p> 
                    )}
                </div>
            </div>

        </div>
      </div>

    </div>
  );
}