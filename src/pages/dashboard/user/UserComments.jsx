import LoadingScreen from '../../../components/LoadingScreen';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Edit2, Trash2, Star } from 'lucide-react';

export default function UserComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get('/api/user/comments');
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
  };

  const cancelDelete = () => {
    setDeletingId(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/user/comments/${id}`);
      setComments(comments.filter(c => c._id !== id));
      setDeletingId(null);
      toast.success('Comment deleted');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditText(c.text);
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(`/api/user/comments/${id}`, { text: editText });
      setComments(comments.map(c => c._id === id ? res.data : c));
      setEditingId(null);
      toast.success('Comment updated');
      fetchComments(); // refresh to get populated lawyer data if necessary
    } catch (err) {
      toast.error('Failed to update comment');
    }
  };

  if (loading) return <LoadingScreen message="Loading comments..." />;

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-8">My Comments</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
            <div className="flex items-center space-x-3 mb-4">
              <img src={comment.lawyerId?.photoURL} alt="" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-bold text-slate-900 dark:text-slate-50 text-sm">Lawyer: {comment.lawyerId?.fullName}</p>
                  {comment.rating && (
                    <div className="flex items-center">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{comment.rating}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-300">{new Date(comment.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            {editingId === comment._id ? (
              <div className="flex-1 mb-4 flex flex-col">
                <textarea 
                  className="w-full p-2 border border-blue-300 rounded mb-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white dark:border-slate-700"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                />
                <div className="flex space-x-2">
                  <button onClick={() => handleUpdate(comment._id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Save</button>
                  <button onClick={() => setEditingId(null)} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded text-sm hover:bg-slate-300">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-slate-600 dark:text-slate-400 flex-1 mb-4">{comment.text}</p>
            )}

            {!editingId && (
              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
                <button onClick={() => startEdit(comment)} className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
                  <Edit2 className="w-4 h-4 mr-1" /> Edit
                </button>
                {deletingId === comment._id ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Confirm?</span>
                    <button onClick={() => handleDelete(comment._id)} className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 bg-red-50 px-2 py-0.5 rounded">
                      Yes
                    </button>
                    <button onClick={cancelDelete} className="text-slate-600 dark:text-slate-400 hover:text-slate-800 text-sm font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                      No
                    </button>
                  </div>
                ) : (
                  <button onClick={() => confirmDelete(comment._id)} className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium">
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            You haven't posted any comments yet.
          </div>
        )}
      </div>
    </div>
  );
}
