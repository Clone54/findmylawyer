import LoadingScreen from '../../../components/LoadingScreen';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Check, X } from 'lucide-react';

export default function LawyerHiringHistory() {
  const [hires, setHires] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHires();
  }, []);

  const fetchHires = async () => {
    try {
      const res = await axios.get('/api/lawyer/hiring-history');
      setHires(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/lawyer/hire/${id}/status`, { status });
      toast.success(`Request ${status}`);
      fetchHires();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <LoadingScreen message="Loading history..." />;

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-8">Client Requests</h2>
      
      {/* Mobile View (Cards) */}
      <div className="md:hidden space-y-4">
        {hires.map((hire) => (
           <div key={hire._id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
             <div className="flex justify-between items-start mb-4">
               <div className="flex items-center">
                 <img className="h-12 w-12 rounded-full object-cover mr-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" src={hire.clientId?.photoURL} alt="" />
                 <div>
                   <div className="text-sm font-bold text-slate-900 dark:text-slate-50 leading-tight">{hire.clientId?.fullName}</div>
                   <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hire.clientId?.email}</div>
                 </div>
               </div>
               <span className={`px-2.5 py-1 text-xs font-bold rounded-full border
                 ${hire.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                   hire.status === 'accepted' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                   hire.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                   'bg-green-50 text-green-700 border-green-200'}`}>
                 {hire.status.toUpperCase()}
               </span>
             </div>
             
             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 mb-4 bg-slate-50/50 -mx-4 px-4 pb-4">
               <div>
                 <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider mb-1">Fee Offered</span>
                 <span className="font-extrabold text-slate-900 dark:text-slate-50 text-lg"><span className="font-extrabold text-[1.1em] mr-[2px]">৳</span>{hire.fee}</span>
               </div>
               <div className="text-right">
                 <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider mb-1">Date</span>
                 <span className="text-slate-700 dark:text-slate-300 font-medium">{new Date(hire.requestDate).toLocaleDateString()}</span>
               </div>
             </div>
             
             {hire.status === 'pending' ? (
               <div className="flex space-x-3">
                 <button onClick={() => updateStatus(hire._id, 'accepted')} className="flex-1 flex justify-center items-center text-green-700 bg-green-50/80 hover:bg-green-100 border border-green-200 py-2.5 rounded-lg text-sm font-bold transition shadow-sm">
                   <Check className="w-4 h-4 mr-1.5" /> Accept
                 </button>
                 <button onClick={() => updateStatus(hire._id, 'rejected')} className="flex-1 flex justify-center items-center text-red-700 bg-red-50/80 hover:bg-red-100 border border-red-200 py-2.5 rounded-lg text-sm font-bold transition shadow-sm">
                   <X className="w-4 h-4 mr-1.5" /> Reject
                 </button>
               </div>
             ) : (
               <div className="w-full text-center text-slate-400 dark:text-slate-300 text-sm font-medium py-1.5 px-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-800">
                 Responded
               </div>
             )}
           </div>
        ))}
        {hires.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400 font-medium">
            No client requests yet.
          </div>
        )}
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fee</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
              {hires.map((hire) => (
                <tr key={hire._id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full object-cover mr-3" src={hire.clientId?.photoURL} alt="" />
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-50">{hire.clientId?.fullName}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{hire.clientId?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50 font-medium"><span className="font-extrabold text-[1.1em] mr-[2px]">৳</span>{hire.fee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(hire.requestDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${hire.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        hire.status === 'accepted' ? 'bg-blue-100 text-blue-800' : 
                        hire.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {hire.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {hire.status === 'pending' ? (
                      <div className="flex justify-center space-x-2">
                        <button onClick={() => updateStatus(hire._id, 'accepted')} className="text-green-600 hover:bg-green-50 p-2 rounded-full border border-green-200" title="Accept">
                          <Check className="w-5 h-5" />
                        </button>
                        <button onClick={() => updateStatus(hire._id, 'rejected')} className="text-red-600 hover:bg-red-50 p-2 rounded-full border border-red-200" title="Reject">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-300 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {hires.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No client requests yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
