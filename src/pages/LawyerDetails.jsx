import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Calendar, Star, MapPin, Briefcase, Award, X, MessageSquare, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { FullScreenLoading } from '../components/LoadingScreen';

export default function LawyerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHireModal, setShowHireModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, commRes] = await Promise.all([
          axios.get(`/api/lawyers/${id}`),
          axios.get(`/api/comments/lawyer/${id}`)
        ]);
        setProfile(profRes.data);
        setComments(commRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleHire = async () => {
    if (!user) {
      toast.error('Please login to hire a lawyer');
      navigate('/login');
      return;
    }
    if (user.role !== 'user') {
      toast.error('Only clients can hire lawyers');
      return;
    }
    
    try {
      await axios.post('/api/user/hire', { lawyerId: profile.userId._id, fee: profile.hourlyRate });
      toast.success('Hiring request sent successfully!');
      setShowHireModal(false);
      navigate('/dashboard/user/hiring-history');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    }
  };

  if (loading) return <FullScreenLoading message="Loading Profile..." />;
  
  if (!profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 pb-20">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm text-center max-w-md">
        <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Lawyer Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">We couldn't find the lawyer profile you're looking for.</p>
        <button onClick={() => navigate('/browse')} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">
          Back to Directory
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-800 min-h-screen pb-20 font-sans">
      
      <div className="h-64 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 w-full object-cover relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 sm:p-10 mb-8 border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            <div className="relative shrink-0 mx-auto md:mx-0">
              <img 
                src={profile.userId?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.userId?.fullName)}&background=random`} 
                alt={profile.userId?.fullName} 
                className="w-48 h-48 rounded-2xl object-cover border-8 border-white shadow-lg bg-white dark:bg-slate-900" 
              />
              <div className={`absolute -bottom-3 -right-3 p-2 rounded-xl backdrop-blur-md border shadow-sm ${profile.isAvailable ? 'bg-green-100/80 border-green-200 text-green-700' : 'bg-red-100/80 border-red-200 text-red-700'}`}>
                {profile.isAvailable ? (
                   <span className="flex items-center text-sm font-bold uppercase tracking-wider"><CheckCircle2 className="w-4 h-4 mr-1" /> Available</span>
                ) : (
                   <span className="flex items-center text-sm font-bold uppercase tracking-wider"><X className="w-4 h-4 mr-1" /> Busy</span>
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left mt-2 w-full">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-tight mb-2">
                    {profile.userId?.fullName}
                  </h1>
                  <p className="text-xl font-medium text-blue-600 mb-4 flex items-center justify-center md:justify-start">
                    <Briefcase className="w-5 h-5 mr-2 opacity-80" />
                    {profile.specialization}
                  </p>
                </div>
                
                <div className="shrink-0">
                   <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-center sm:text-right shadow-sm">
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Consultation Fee</p>
                      <div className="flex items-baseline justify-center sm:justify-end">
                        <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50"><span className="font-extrabold text-[1.1em] mr-[2px]">৳</span>{profile.hourlyRate}</span>
                        <span className="text-slate-500 dark:text-slate-400 ml-1 font-medium">/hr</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-100 dark:border-slate-800">
                  <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
                  {comments.length > 0 ? (comments.reduce((acc, curr) => acc + curr.rating, 0) / comments.length).toFixed(1) : 'New'} Rating
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-100 dark:border-slate-800">
                  <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                  {comments.length} Reviews
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-100 dark:border-slate-800">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                  Joined {new Date(profile.createdAt).getFullYear()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-8 border border-slate-100 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6 flex items-center">
                <Award className="w-6 h-6 mr-3 text-blue-600" />
                Professional Summary
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap text-lg">
                  {profile.bio || "No professional summary provided."}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-8 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center">
                  <MessageSquare className="w-6 h-6 mr-3 text-blue-600" />
                  Client Reviews
                </h2>
                <span className="bg-blue-50 text-blue-700 py-1 px-3 rounded-full text-sm font-bold">
                  {comments.length}
                </span>
              </div>

              <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                     <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                     <p className="text-slate-500 dark:text-slate-400 font-medium">No reviews yet for this lawyer.</p>
                  </div>
                ) : (
                  comments.map((comment, index) => (
                    <div key={comment._id} className={`${index !== comments.length - 1 ? 'border-b border-slate-100 dark:border-slate-800 pb-6' : ''}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={comment.userId?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userId?.fullName)}&background=random`} 
                            alt={comment.userId?.fullName} 
                            className="w-12 h-12 rounded-full ring-2 ring-slate-100 object-cover bg-slate-50 dark:bg-slate-800" 
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-50">{comment.userId?.fullName || 'Anonymous'}</p>
                            <p className="text-xs font-medium text-slate-400 dark:text-slate-300 mt-0.5">{new Date(comment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                        </div>
                        {comment.rating && (
                          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                            <span className="font-bold text-yellow-700 mr-1 text-sm">{comment.rating}.0</span>
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          </div>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/50 p-4 rounded-xl text-base">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-800 text-center overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
              
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-50 mb-2">Ready to proceed?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">Request a consultation or hire {profile.userId?.fullName?.split(' ')[0] || 'this lawyer'} for your legal needs.</p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setShowHireModal(true)}
                  disabled={!profile.isAvailable}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center text-lg"
                >
                  {profile.isAvailable ? 'Request to Hire' : 'Currently Unavailable'}
                </button>
                <div className="text-xs text-slate-400 dark:text-slate-300 font-medium">You won't be charged yet</div>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>

      {showHireModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setShowHireModal(false)} 
                className="absolute top-6 right-6 text-slate-400 dark:text-slate-300 hover:text-slate-600 transition bg-slate-50 dark:bg-slate-800 rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                 <X className="w-5 h-5" />
              </button>
              
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                 <Briefcase className="w-6 h-6" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Confirm Hiring Request</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">You are about to send a hiring request to <span className="font-bold text-slate-900 dark:text-slate-50">{profile.userId?.fullName}</span>. They will receive your request on their dashboard to accept or decline.</p>
              
              <div className="flex justify-between items-center mb-8 bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center text-slate-700 dark:text-slate-300 font-medium">
                   <Clock className="w-5 h-5 mr-3 text-slate-400 dark:text-slate-300" />
                   Estimated Rate
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-blue-600"><span className="font-extrabold text-[1.1em] mr-[2px]">৳</span>{profile.hourlyRate}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium ml-1">/hr</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                 <button 
                   onClick={() => setShowHireModal(false)} 
                   className="px-6 py-3 font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition border border-slate-200 dark:border-slate-700"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleHire} 
                   className="px-8 py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-md hover:shadow-lg"
                 >
                   Send Request
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

