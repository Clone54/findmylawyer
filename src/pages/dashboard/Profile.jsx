import { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Camera, User, Mail, Shield, Save, Loader2 } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error('Image size must be less than 5MB');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put('/api/user/profile', { fullName, photoURL });
      setUser(res.data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto font-sans">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Your Profile</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage your personal information and account settings.</p>
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Cover Photo Area */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-10">
          
          {/* Avatar Upload */}
          <div className="relative flex justify-center -mt-16 mb-8">
            <div className="relative group">
              <img 
                src={photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=random`} 
                alt="Profile Preview" 
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg bg-white dark:bg-slate-900 transition-opacity group-hover:opacity-80" 
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full shadow-md hover:bg-blue-700 transition-colors border-2 border-white"
                title="Change Photo"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="hidden dark:bg-slate-800 dark:text-white dark:border-slate-700"
              />
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                <User className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-300" />
                Full Name
              </label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-900 dark:text-slate-50 bg-slate-50/50 dark:bg-slate-800 focus:bg-white focus:dark:bg-slate-700"
                placeholder="Enter your full name"
              />
            </div>

            {/* Read-only details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              
              <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                   <Mail className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-300" />
                   Email Address
                 </label>
                 <div className="w-full px-4 py-3 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl font-medium cursor-not-allowed">
                    {user?.email}
                 </div>
                 <p className="text-xs text-slate-400 dark:text-slate-300 mt-1">Email cannot be changed.</p>
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                   <Shield className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-300" />
                   Account Role
                 </label>
                 <div className="flex items-center w-full px-4 py-3 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold capitalize cursor-not-allowed">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      user?.role === 'admin' ? 'bg-purple-500' : 
                      user?.role === 'lawyer' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    {user?.role}
                 </div>
              </div>

            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button 
              type="submit" 
              disabled={loading || (fullName === user?.fullName && photoURL === user?.photoURL)}
              className="flex items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
