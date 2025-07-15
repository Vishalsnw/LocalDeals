
'use client';

import { useState, useEffect } from 'react';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface FavoriteButtonProps {
  offerId: string;
  className?: string;
}

export default function FavoriteButton({ offerId, className = '' }: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, offerId]);

  const checkFavoriteStatus = async () => {
    if (!user) return;
    
    try {
      const favoriteDoc = await getDoc(doc(db, 'favorites', `${user.userId}_${offerId}`));
      setIsFavorite(favoriteDoc.exists());
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const favoriteId = `${user.userId}_${offerId}`;
      
      if (isFavorite) {
        await deleteDoc(doc(db, 'favorites', favoriteId));
        setIsFavorite(false);
      } else {
        await setDoc(doc(db, 'favorites', favoriteId), {
          userId: user.userId,
          offerId,
          createdAt: new Date().toISOString()
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-200 ${
        isFavorite 
          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
          : 'text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-red-500'
      } ${className}`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {loading ? (
        <div className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <span className="text-xl">{isFavorite ? '❤️' : '🤍'}</span>
      )}
    </button>
  );
}
