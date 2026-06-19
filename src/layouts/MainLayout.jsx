import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Home, Users, LayoutDashboard, LogIn, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../assests/logo.png';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-800 font-sans text-slate-900 dark:text-slate-50">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={logo}
                alt="LegalEase Logo"
                className="w-9 h-9 object-contain drop-shadow-sm rounded-[40%]"
              />
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-slate-50">LegalEase</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <button
                onClick={toggleTheme}
                className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:bg-slate-800"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/browse" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Browse Lawyers</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Dashboard</Link>
                  <button onClick={logout} className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-red-600 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-3 text-sm">
                  <Link to="/login" className="flex items-center space-x-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition font-semibold">
                    <span>Login</span>
                  </Link>
                  <Link to="/register" className="flex items-center space-x-1 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-semibold shadow-sm hover:shadow-md">
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </nav>

            <button
              className="md:hidden p-2 -mr-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors relative z-50 flex items-center justify-center"
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
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
            />
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden fixed top-20 left-4 right-4 bg-white dark:bg-slate-900 rounded-3xl shadow-xl z-50 border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              <div className="flex flex-col p-2">
                <Link to="/" className="flex items-center space-x-3 px-4 py-4 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 rounded-2xl font-semibold transition-colors">
                  <Home className="w-5 h-5 text-slate-400 dark:text-slate-300" />
                  <span>Home</span>
                </Link>
                <Link to="/browse" className="flex items-center space-x-3 px-4 py-4 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 rounded-2xl font-semibold transition-colors">
                  <Users className="w-5 h-5 text-slate-400 dark:text-slate-300" />
                  <span>Browse Lawyers</span>
                </Link>

                <button onClick={toggleTheme} className="flex items-center space-x-3 px-4 py-4 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 rounded-2xl font-semibold transition-colors text-left">
                  {theme === 'dark' ? <Sun className="w-5 h-5 text-slate-400 dark:text-slate-300" /> : <Moon className="w-5 h-5 text-slate-400 dark:text-slate-300" />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-4"></div>

                {user ? (
                  <>
                    <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-4 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 rounded-2xl font-semibold transition-colors">
                      <LayoutDashboard className="w-5 h-5 text-slate-400 dark:text-slate-300" />
                      <span>Dashboard</span>
                    </Link>
                    <button onClick={logout} className="flex items-center space-x-3 px-4 py-4 text-red-600 hover:bg-red-50 rounded-2xl font-semibold transition-colors text-left">
                      <LogOut className="w-5 h-5 opacity-80" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 px-2 pb-2">
                    <Link to="/login" className="flex items-center justify-center space-x-2 px-4 py-3.5 mt-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 rounded-2xl font-bold transition-colors">
                      <LogIn className="w-4 h-4" />
                      <span>Login to Account</span>
                    </Link>
                    <Link to="/register" className="flex items-center justify-center space-x-2 px-4 py-3.5 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl font-bold shadow-md transition-colors">
                      <span>Create Account</span>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 py-12 text-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-4">LegalEase</h3>
            <p>Democratizing access to legal aid. Hire expert legal counsel with ease.</p>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-blue-600 dark:hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/browse" className="hover:text-blue-600 dark:hover:text-white transition-colors">Find a Lawyer</Link></li>
              <li><Link to="/" className="hover:text-blue-600 dark:hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/" className="hover:text-blue-600 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Follow Us</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Facebook</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Newsletter</h4>
            <div className="flex space-x-2">
              <input type="email" placeholder="Email address" className="bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white px-3 py-2 rounded focus:outline-none focus:border-blue-500 w-full transition-colors" />
              <button className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors">Go</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-500">
          &copy; {new Date().getFullYear()} LegalEase. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
