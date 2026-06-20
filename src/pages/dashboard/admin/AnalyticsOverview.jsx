import LoadingScreen from '../../../components/LoadingScreen';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Briefcase, FileText, Banknote } from 'lucide-react';

export default function AnalyticsOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    totalHires: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/analytics');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen message="Loading..." />;

  const cards = [
    { title: 'Total Clients', value: stats.totalUsers, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { title: 'Total Lawyers', value: stats.totalLawyers, icon: Briefcase, color: 'bg-purple-100 text-purple-600' },
    { title: 'Total Hirings', value: stats.totalHires, icon: FileText, color: 'bg-green-100 text-green-600' },
    { title: 'Total Revenue', value: <><span className="font-extrabold text-[1.1em] mr-[2px]">৳</span>{(stats?.totalRevenue || 0).toLocaleString()}</>, icon: Banknote, color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-8">Platform Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center text-center">
              <div className={`p-4 rounded-full ${card.color} mb-4`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{card.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
