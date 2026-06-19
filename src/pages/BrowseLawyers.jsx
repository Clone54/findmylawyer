import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingScreen from '../components/LoadingScreen';

export default function BrowseLawyers() {
  const [params] = useSearchParams();
  const initCategory = params.get('category') || '';
  
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initCategory);
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [feeRangeFilter, setFeeRangeFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/lawyers');
      setLawyers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLawyers = lawyers.filter(l => {
    const term = search.toLowerCase();
    const nameMatch = l.userId?.fullName?.toLowerCase().includes(term);
    const specMatch = l.specialization?.toLowerCase().includes(term);
    const matchesSearch = nameMatch || specMatch;

    const matchesSpec = specializationFilter ? l.specialization === specializationFilter : true;
    
    let matchesFee = true;
    if (feeRangeFilter) {
      if (feeRangeFilter === '0-1000') matchesFee = l.hourlyRate <= 1000;
      else if (feeRangeFilter === '1000-3000') matchesFee = l.hourlyRate > 1000 && l.hourlyRate <= 3000;
      else if (feeRangeFilter === '3000+') matchesFee = l.hourlyRate > 3000;
    }
    
    const matchesAvailability = availabilityFilter === 'available' ? l.isAvailable : true;
    
    return matchesSearch && matchesSpec && matchesFee && matchesAvailability;
  });

  const allSpecializations = [...new Set(lawyers.map(l => l.specialization).filter(Boolean))].sort();

  const totalPages = Math.ceil(filteredLawyers.length / itemsPerPage);
  const displayedLawyers = filteredLawyers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-slate-50 dark:bg-slate-800 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Browse Lawyers</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Find the perfect legal expert for your case.</p>
            </div>
            
            <div className="w-full md:w-96 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-300" />
              <input 
                type="text" 
                placeholder="Search by name or specialization..." 
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Specialization</label>
              <select 
                value={specializationFilter} 
                onChange={(e) => { setSpecializationFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="">All Specializations</option>
                {allSpecializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hourly Fee Range</label>
              <select 
                value={feeRangeFilter} 
                onChange={(e) => { setFeeRangeFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="">Any Fee</option>
                <option value="0-1000">Up to ৳1,000/hr</option>
                <option value="1000-3000">৳1,000 - ৳3,000/hr</option>
                <option value="3000+">Above ৳3,000/hr</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Availability</label>
              <select 
                value={availabilityFilter} 
                onChange={(e) => { setAvailabilityFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="">Any Availability</option>
                <option value="available">Available Now</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingScreen message="Searching Directory..." />
        ) : filteredLawyers.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <Filter className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No lawyers found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
                hidden: {}
              }}
            >
              {displayedLawyers.map((lawyer) => (
                 <motion.div 
                    key={lawyer._id}
                    variants={{
                      hidden: { opacity: 0, scale: 0.95 },
                      visible: { opacity: 1, scale: 1 }
                    }}
                 >
                    <Link to={`/lawyer/${lawyer.userId?._id}`} className="block h-full bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow group relative">
                      {!lawyer.isAvailable && (
                        <span className="absolute top-3 right-3 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">Busy</span>
                      )}
                      <div className="flex flex-col items-center text-center">
                        <img src={lawyer.userId?.photoURL} alt={lawyer.userId?.fullName} className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 group-hover:border-blue-50 transition mb-4" />
                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 group-hover:text-blue-600 transition-colors">{lawyer.userId?.fullName}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-3">{lawyer.specialization}</p>
                        <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-3 mt-auto flex justify-between items-center">
                          <span className="text-slate-900 dark:text-slate-50 font-bold"><span className="font-extrabold text-[1.1em] mr-[2px]">৳</span>{lawyer.hourlyRate}/hr</span>
                          <span className="text-blue-600 text-sm font-medium">View Profile</span>
                        </div>
                      </div>
                    </Link>
                 </motion.div>
              ))}
            </motion.div>

            {totalPages > 1 && (
              <div className="mt-10 flex justify-center space-x-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 disabled:opacity-50 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Prev
                </button>
                <div className="flex items-center space-x-1 px-4 text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 disabled:opacity-50 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
