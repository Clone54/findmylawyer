import LoadingScreen from '../../../components/LoadingScreen';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ManageLegalProfile() {
  const [profile, setProfile] = useState({
    specialization: '',
    bio: '',
    hourlyRate: '',
    isAvailable: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/lawyer/profile');
      if (res.data) setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put('/api/lawyer/profile', profile);
      setProfile(res.data);
      toast.success('Legal profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setProfile({ ...profile, [e.target.name]: value });
  };

  if (loading) return <LoadingScreen message="Loading profile..." />;

  return (
    <div className="max-w-3xl">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-8">Manage Legal Services</h2>
      
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Specialization / Category</label>
            <select 
              name="specialization" 
              required
              value={profile.specialization}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700"
            >
              <option value="">Select a category</option>
              <option value="Criminal">Criminal</option>
              <option value="Corporate">Corporate</option>
              <option value="Family">Family</option>
              <option value="Immigration">Immigration</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Intellectual Property">Intellectual Property</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hourly Fee (<span className="font-extrabold text-[1.1em]">৳</span>)</label>
            <input 
              type="number" 
              name="hourlyRate"
              required
              min="0"
              value={profile.hourlyRate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-white dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Professional Summary (Bio)</label>
            <textarea 
              name="bio"
              required
              rows="5"
              value={profile.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-white dark:border-slate-700"
              placeholder="Describe your experience and services offered..."
            />
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <input 
              type="checkbox" 
              name="isAvailable"
              id="isAvailable"
              checked={profile.isAvailable}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:border-slate-700"
            />
            <label htmlFor="isAvailable" className="text-sm font-medium text-slate-900 dark:text-slate-50">
              I am currently available to take new clients
            </label>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
