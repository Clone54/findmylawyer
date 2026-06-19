import LoadingScreen from '../../../components/LoadingScreen';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`/api/admin/users/${id}/role`, { role: newRole });
      toast.success('Role updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to change role');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  if (loading) return <LoadingScreen message="Loading users..." />;

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-8">Manage Users</h2>
      
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full object-cover mr-3" src={u.photoURL} alt="" />
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-50">{u.fullName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <select 
                        value={u.role} 
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="text-sm border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 py-1 px-2 border focus:outline-none"
                     >
                       <option value="user">User</option>
                       <option value="lawyer">Lawyer</option>
                       <option value="admin">Admin</option>
                     </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button onClick={() => handleDelete(u._id)} className="text-red-600 hover:text-red-900 font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
