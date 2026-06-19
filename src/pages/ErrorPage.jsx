import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center p-4">
      <h1 className="text-9xl font-black text-slate-200 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">Page not found</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md text-center">Sorry, we couldn't find the page you're looking for. Please check the URL or return home.</p>
      <Link to="/" className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
        <Home className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}
