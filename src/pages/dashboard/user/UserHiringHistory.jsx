import LoadingScreen from '../../../components/LoadingScreen';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Banknote, ExternalLink, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserHiringHistory() {
  const [hires, setHires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedHire, setSelectedHire] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentHireId, setSelectedPaymentHireId] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    fetchHires();
  }, []);

  const fetchHires = async () => {
    try {
      const res = await axios.get('/api/user/hiring-history');
      setHires(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openPaymentModal = (hireId) => {
    setSelectedPaymentHireId(hireId);
    setCardNumber('');
    setExpiry('');
    setCvc('');
    setPaymentModalOpen(true);
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/payment/create-intent', { hireId: selectedPaymentHireId });
      await axios.post('/api/payment/confirm', { hireId: selectedPaymentHireId, transactionId: res.data.paymentIntentId });
      toast.success('Payment successfully completed!');
      setPaymentModalOpen(false);
      fetchHires();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    }
  };

  const openReviewModal = (hire) => {
    setSelectedHire(hire);
    setReviewText('');
    setRating(5);
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    try {
      await axios.post('/api/user/comment', {
        lawyerId: selectedHire.lawyerId._id,
        hireRequestId: selectedHire._id,
        text: reviewText,
        rating
      });
      toast.success('Review posted successfully!');
      setReviewModalOpen(false);
      fetchHires();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post review');
    }
  };

  if (loading) return <LoadingScreen message="Loading history..." />;

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-8">My Hiring History</h2>

      <div className="md:hidden space-y-4">
        {Array.isArray(hires) && hires.map((hire) => (
           <div key={hire._id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
             <div className="flex justify-between items-start mb-4">
               <div className="flex items-center">
                 <img className="h-12 w-12 rounded-full object-cover mr-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" src={hire.lawyerId?.photoURL} alt="" />
                 <div>
                   <div className="text-sm font-bold text-slate-900 dark:text-slate-50 leading-tight">{hire.lawyerId?.fullName}</div>
                   <Link to={`/lawyer/${hire.lawyerId?._id}`} className="text-xs text-blue-600 flex items-center hover:underline mt-1"><ExternalLink className="w-3 h-3 mr-1"/> View Profile</Link>
                 </div>
               </div>
               <span className={`px-2.5 py-1 text-xs font-bold rounded-full border
                 ${hire.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                   hire.status === 'accepted' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                   hire.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                   'bg-green-50 text-green-700 border-green-200'}`}>
                 {hire.status.toUpperCase()}
               </span>
             </div>
             
             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 mb-4 bg-slate-50/50 -mx-4 px-4 pb-4">
               <div>
                 <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider mb-1">Total Fee</span>
                 <span className="font-extrabold text-slate-900 dark:text-slate-50 text-lg"><span className="font-extrabold text-[1.1em] mr-[2px]">৳</span>{hire.fee}</span>
               </div>
               <div className="text-right">
                 <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider mb-1">Date</span>
                 <span className="text-slate-700 dark:text-slate-300 font-medium">{new Date(hire.requestDate).toLocaleDateString()}</span>
               </div>
             </div>
             
             <div className="flex justify-center">
               {hire.status === 'accepted' ? (
                 <button onClick={() => openPaymentModal(hire._id)} className="w-full justify-center inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 px-3 py-2.5 rounded-lg text-sm font-bold transition shadow-sm">
                   <Banknote className="w-4 h-4 mr-1" /> Pay Amount Now
                 </button>
               ) : hire.status === 'paid' ? (
                 hire.isReviewed ? (
                   <span className="w-full justify-center text-green-700 font-bold text-sm bg-green-50 px-3 py-2.5 rounded-lg inline-flex items-center text-center border border-green-200">
                     <Star className="w-4 h-4 fill-current mr-1 text-green-500" /> Review Submitted
                   </span>
                 ) : (
                   <button onClick={() => openReviewModal(hire)} className="w-full justify-center inline-flex items-center text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-2.5 rounded-lg text-sm font-bold transition shadow-sm">
                     <Star className="w-4 h-4 mr-1" /> Write a Review
                   </button>
                 )
               ) : (
                 <div className="w-full text-center text-slate-400 dark:text-slate-300 text-sm font-medium py-1.5 px-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-800">
                   No action available
                 </div>
               )}
             </div>
           </div>
        ))}
        {hires.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400 font-medium">
            No hiring history found.
          </div>
        )}
      </div>

      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lawyer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fee</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
              {Array.isArray(hires) && hires.map((hire) => (
                <tr key={hire._id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full object-cover mr-3" src={hire.lawyerId?.photoURL} alt="" />
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-50">{hire.lawyerId?.fullName}</div>
                        <Link to={`/lawyer/${hire.lawyerId?._id}`} className="text-xs text-blue-600 flex items-center hover:underline"><ExternalLink className="w-3 h-3 mr-1"/> Profile</Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50 font-medium">
                    <span className="font-extrabold text-[1.1em] mr-[2px]">৳</span>{hire.fee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {new Date(hire.requestDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${hire.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        hire.status === 'accepted' ? 'bg-blue-100 text-blue-800' : 
                        hire.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {hire.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {hire.status === 'accepted' ? (
                      <button onClick={() => openPaymentModal(hire._id)} className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md text-xs font-bold transition">
                        <Banknote className="w-4 h-4 mr-1" /> Pay Now
                      </button>
                    ) : hire.status === 'paid' ? (
                      hire.isReviewed ? (
                        <span className="text-green-600 font-bold text-xs bg-green-50 px-3 py-1.5 rounded-md inline-flex items-center">
                          <Star className="w-3 h-3 justify-center fill-current mr-1" /> Reviewed
                        </span>
                      ) : (
                        <button onClick={() => openReviewModal(hire)} className="inline-flex items-center text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-md text-xs font-bold transition">
                          <Star className="w-3 h-3 mr-1" /> Leave A Review
                        </button>
                      )
                    ) : (
                      <span className="text-slate-400 dark:text-slate-300 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {hires.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No hiring history found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
           <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">Complete Payment</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Enter your test card details to complete the payment for this hiring request.
            </p>
            <form onSubmit={handlePaySubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono dark:bg-slate-800 dark:text-white dark:border-slate-700"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-4 mb-6">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono dark:bg-slate-800 dark:text-white dark:border-slate-700"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CVC</label>
                  <input
                    type="password"
                    placeholder="123"
                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono dark:bg-slate-800 dark:text-white dark:border-slate-700"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    required
                    maxLength="4"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  Pay dummy amount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {reviewModalOpen && selectedHire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">Leave a Review</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Write a review for your consultation with <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedHire.lawyerId.fullName}</span>.
            </p>
            <form onSubmit={handleSubmitReview}>
              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32 mb-4"
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
