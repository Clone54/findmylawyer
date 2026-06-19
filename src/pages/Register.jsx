import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Scale, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const res = await register(formData);
    if(res.success) {
      if(res.role === 'lawyer') navigate('/dashboard/lawyer/manage-legal-profile');
      else if (res.role === 'user') navigate('/dashboard/profile');
      else navigate('/');
    }
  };

  const handleGoogleSuccess = async (response) => {
    const res = await googleLogin(response.credential, formData.role);
    if(res.success) {
      if(res.isNewUser) {
        if(res.role === 'lawyer') navigate('/dashboard/lawyer/manage-legal-profile');
        else if (res.role === 'user') navigate('/dashboard/profile');
        else navigate('/');
      } else {
        if(res.role === 'admin') navigate('/dashboard/admin/analytics');
        else navigate('/');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">Create an account</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Join LegalEase today</p>
        </div>

        <div className="mt-4 mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'user'})}
                className={`py-2 px-4 rounded-md text-sm font-medium border ${formData.role === 'user' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'lawyer'})}
                className={`py-2 px-4 rounded-md text-sm font-medium border ${formData.role === 'lawyer' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                Lawyer
              </button>
            </div>
        </div>

        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">Or continue with</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400 dark:text-slate-300" />
              </div>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="pl-10 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-800 dark:text-white dark:border-slate-700" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400 dark:text-slate-300" />
              </div>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email address" className="pl-10 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-800 dark:text-white dark:border-slate-700" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 dark:text-slate-300" />
              </div>
              <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} placeholder="Password" className="pl-10 pr-10 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-800 dark:text-white dark:border-slate-700" />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-300 hover:text-slate-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
             <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 dark:text-slate-300" />
              </div>
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="pl-10 pr-10 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-800 dark:text-white dark:border-slate-700" />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-300 hover:text-slate-600 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">I am a...</label>
            <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-800 dark:text-white dark:border-slate-700">
              <option value="user">Client (Looking for a lawyer)</option>
              <option value="lawyer">Lawyer (Offering legal services)</option>
            </select>
          </div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-6">
            Register
          </button>
        </form>
        <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link>
            </p>
        </div>
      </div>
    </div>
  );
}
