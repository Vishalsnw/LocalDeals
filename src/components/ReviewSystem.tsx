
'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface Review {
  id: string;
  userId: string;
  userName: string;
  offerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewSystemProps {
  offerId: string;
}

export default function ReviewSystem({ offerId }: ReviewSystemProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [offerId]);

  const fetchReviews = async () => {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('offerId', '==', offerId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const submitReview = async () => {
    if (!user || !newReview.comment.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        userId: user.userId,
        userName: user.name || 'Anonymous',
        offerId,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date().toISOString()
      });
      
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error) {
      console.error('Error adding review:', error);
    }
    setLoading(false);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Reviews & Ratings</h3>
        <div className="flex items-center space-x-2">
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`text-lg ${parseFloat(averageRating) >= star ? '★' : '☆'}`}>
                {parseFloat(averageRating) >= star ? '★' : '☆'}
              </span>
            ))}
          </div>
          <span className="text-gray-600 text-sm">({reviews.length} reviews)</span>
        </div>
      </div>

      {/* Add Review Form */}
      {user && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3">Write a Review</h4>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className={`text-2xl ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="Share your experience..."
            className="w-full p-3 border rounded-lg resize-none"
            rows={3}
          />
          <button
            onClick={submitReview}
            disabled={loading || !newReview.comment.trim()}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{review.userName}</span>
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= review.rating ? '★' : '☆'}>
                      {star <= review.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
