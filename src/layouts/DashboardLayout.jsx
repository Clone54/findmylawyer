import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, LayoutDashboard, UserCircle, History, Settings, MessageSquare,
  Briefcase, Activity, LogOut, Hexagon, ArrowLeft, MoreVertical, X, Moon, Sun
} from 'lucide-react';
import logo from '../assests/logo.png';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  const getLinks = () => {
    switch (user.role) {
      case 'user':
        return [
          { to: '/dashboard/profile', icon: UserCircle, label: 'Profile' },
          { to: '/dashboard/user/hiring-history', icon: History, label: 'Hiring History' },
          { to: '/dashboard/user/comments', icon: MessageSquare, label: 'Comments' },
        ];
      case 'lawyer':
        return [
          { to: '/dashboard/profile', icon: UserCircle, label: 'Profile' },
          { to: '/dashboard/lawyer/manage-legal-profile', icon: Briefcase, label: 'Manage Services' },
          { to: '/dashboard/lawyer/hiring-history', icon: History, label: 'Client Requests' },
        ];
      case 'admin':
        return [
          { to: '/dashboard/profile', icon: UserCircle, label: 'Profile' },
          { to: '/dashboard/admin/analytics', icon: Activity, label: 'Analytics' },
          { to: '/dashboard/admin/manage-users', icon: Users, label: 'Manage Users' },
          { to: '/dashboard/admin/all-transactions', icon: Activity, label: 'Transactions' },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex-shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-800">
        <div className="p-4 md:p-6 flex items-center justify-between md:block">
          <div className="flex items-center text-slate-900 dark:text-white md:mb-8">
            <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1 md:p-0 md:mr-3 mr-2" title="Back to Home">
              <ArrowLeft className="w-6 h-6 md:w-5 md:h-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <img
                src={logo}
                alt="LegalEase Logo"
                className="w-9 h-9 object-contain drop-shadow-sm rounded-[40%]"
              />
              <span className="font-bold text-xl tracking-tight hidden md:block">LegalEase Portal</span>
              <span className="font-bold text-xl tracking-tight md:hidden">Portal</span>
            </div>
          </div>

          <button
            className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <MoreVertical className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        <div className={`flex-col flex-1 px-6 pb-6 md:flex ${mobileMenuOpen ? 'flex' : 'hidden md:flex'}`}>
          <div className="mb-8 flex items-center space-x-3 pt-4 md:pt-0 border-t border-slate-200 dark:border-slate-800 md:border-t-0">
            <img src={user.photoURL} alt={user.fullName} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
            <div>
              <p className="text-slate-900 dark:text-white text-sm font-medium leading-tight">{user.fullName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-8 flex flex-col space-y-2">
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-3 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors w-full px-3 py-2"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center space-x-3 text-sm text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors w-full px-3 py-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
