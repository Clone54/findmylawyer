import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Scale, CheckCircle2, Shield, Search } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import heroImage from '../assests/hero.jpg';

export default function Home() {
  const [featuredLawyers, setFeaturedLawyers] = useState([]);
  const [topLawyers, setTopLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalLawyers: 0, successfulHires: 0, currentReviews: 0 });
  
  useEffect(() => {
    setLoading(true);
    
    Promise.all([
      axios.get('/api/lawyers?limit=6'),
      axios.get('/api/lawyers/top'),
      axios.get('/api/stats')
    ]).then(([featuredRes, topRes, statsRes]) => {
      const shuffled = featuredRes.data.sort(() => 0.5 - Math.random());
      setFeaturedLawyers(shuffled.slice(0, 6));
      setTopLawyers(topRes.data);
      setStats(statsRes.data);
    }).catch(err => {
      console.error("Error fetching data:", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const categories = ['Criminal', 'Corporate', 'Family', 'Immigration', 'Real Estate', 'Intellectual Property'];

  return (
    <div>
      {/* Hero Section */}
      <section
          className="text-white py-24 md:py-32 relative overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-slate-900/80 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
            >
              Find &amp; Hire <span className="text-blue-500">Expert Legal Counsel</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
            >
              Democratizing access to legal aid. Connect with top-tier professionals seamlessly.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/browse" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg inline-flex items-center space-x-2 transition shadow-lg shadow-blue-900/50">
                <Search className="w-5 h-5" />
                <span>Browse Lawyers</span>
              </Link>
            </motion.div>
          </div>
        </section>

      {/* Overview Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <div className="text-4xl font-extrabold text-blue-600 mb-2">{stats.totalLawyers}</div>
              <div className="text-slate-600 dark:text-slate-400 font-medium">Total Lawyers</div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <div className="text-4xl font-extrabold text-blue-600 mb-2">{stats.successfulHires}</div>
              <div className="text-slate-600 dark:text-slate-400 font-medium">Successful Hires</div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <div className="text-4xl font-extrabold text-blue-600 mb-2">{stats.currentReviews}</div>
              <div className="text-slate-600 dark:text-slate-400 font-medium">Current Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">Legal Categories</h2>
            <p className="text-slate-600 dark:text-slate-400">Find specialized help for your specific needs.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => (
              <Link 
                key={idx} 
                to={`/browse?category=${cat}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center hover:bg-blue-50 hover:border-blue-200 transition group"
              >
                <Scale className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-300 group-hover:text-blue-500 mb-3 transition" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{cat}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">Featured Lawyers</h2>
            <p className="text-slate-600 dark:text-slate-400">Discover top legal minds ready to assist you.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredLawyers.map((lawyer, idx) => (
              <motion.div 
                key={lawyer._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 transition shadow-sm hover:shadow-md"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img src={lawyer.userId?.photoURL} alt={lawyer.userId?.fullName} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">{lawyer.userId?.fullName}</h3>
                    <p className="text-blue-600 text-sm font-medium">{lawyer.specialization}</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{lawyer.bio}</p>
                <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-4 mt-auto">
                  <span className="font-bold text-slate-900 dark:text-slate-50"><span className="font-extrabold text-[1.1em] mr-[2px]">৳</span>{lawyer.hourlyRate}/hr</span>
                  <Link to={`/lawyer/${lawyer.userId?._id}`} className="text-blue-600 text-sm hover:underline font-medium">View Profile</Link>
                </div>
              </motion.div>
            ))}
            {loading && (
                <div className="col-span-full">
                  <LoadingScreen message="Loading featured professionals..." />
                </div>
            )}
            {!loading && featuredLawyers.length === 0 && (
                <div className="col-span-full text-center text-slate-500 dark:text-slate-400 py-10">No featured professionals found.</div>
            )}
          </div>
        </div>
      </section>

      {/* Top Legal Experts */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">Top Legal Experts</h2>
            <p className="text-slate-600 dark:text-slate-400">Our most hired and trusted legal professionals.</p>
          </div>
          
          <div className="grid grid-cols-1 select-none md:grid-cols-3 gap-8">
            {topLawyers.map((lawyer, idx) => (
              <motion.div
                key={lawyer.userId?._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center transition shadow-sm hover:shadow-lg"
              >
                <div className="relative inline-block mb-4">
                  <img src={lawyer.userId?.photoURL} alt={lawyer.userId?.fullName} className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-blue-50 dark:border-slate-800" />
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white dark:border-slate-900">
                    #{idx + 1}
                  </div>
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-slate-50 mb-1">{lawyer.userId?.fullName}</h3>
                <p className="text-blue-600 text-sm font-medium mb-4">{lawyer.specialization}</p>
                
                <div className="flex justify-center items-center space-x-2 text-slate-600 dark:text-slate-400 text-sm bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-lg inline-flex">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{lawyer.hiresCount}</span> 
                  <span>Hires</span>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <Link to={`/lawyer/${lawyer.userId?._id}`} className="block w-full py-2.5 bg-slate-50 hover:bg-blue-50 text-blue-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-blue-400 rounded-lg font-medium transition-colors">
                    View Profile
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          {loading && (
             <div className="text-center w-full mt-8">
               <LoadingScreen message="Loading top experts..." />
             </div>
          )}
          {!loading && topLawyers.length === 0 && (
              <div className="text-center text-slate-500 dark:text-slate-400 py-10 w-full">No top experts found.</div>
          )}
        </div>
      </section>
    </div>
  );
}
