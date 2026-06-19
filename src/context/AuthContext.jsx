import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser(res.data.user);
      toast.success('Logged in successfully');
      return { success: true, role: res.data.user.role };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return { success: false };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      setUser(res.data.user);
      toast.success('Registered successfully');
      return { success: true, role: res.data.user.role };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      return { success: false };
    }
  };

  const googleLogin = async (credential, role = 'user') => {
    try {
      const res = await axios.post('/api/auth/google', { credential, role });
      setUser(res.data.user);
      toast.success('Logged in with Google');
      return { success: true, role: res.data.user.role, isNewUser: res.data.isNewUser };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google Login failed');
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      toast.success('Logged out');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
