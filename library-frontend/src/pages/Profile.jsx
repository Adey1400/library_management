import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

export default function Profile() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const name = localStorage.getItem("name");

  useEffect(() => {
     
      setLoading(false);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-6">
              <div className="h-20 w-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold">
                  {name ? name[0] : "U"}
              </div>
              <div>
                  <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                  <p className="text-gray-500">Student Account</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Active</span>
              </div>
          </div>
       </div>

       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold mb-4">My Borrowing History</h2>
           <p className="text-gray-500 italic">No books borrowed yet.</p>
         
       </div>
    </div>
  );
}