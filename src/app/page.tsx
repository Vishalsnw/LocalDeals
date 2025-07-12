
'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Offer, CATEGORIES } from '@/types';
import Navbar from '@/components/Navbar';
import OfferCard from '@/components/OfferCard';

export default function Home() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.city) {
      setSelectedCity(user.city);
    }
  }, [user]);

  useEffect(() => {
    fetchOffers();
  }, [selectedCity, selectedCategory]);

  const fetchOffers = async () => {
    if (!selectedCity) return;

    try {
      let q = query(
        collection(db, 'offers'),
        where('city', '==', selectedCity),
        orderBy('createdAt', 'desc')
      );

      if (selectedCategory) {
        q = query(
          collection(db, 'offers'),
          where('city', '==', selectedCity),
          where('category', '==', selectedCategory),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      const offersData = querySnapshot.docs.map(doc => ({
        offerId: doc.id,
        ...doc.data()
      } as Offer));

      setOffers(offersData);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Local Deals in Your City
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a city</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                <option value="Houston">Houston</option>
                <option value="Phoenix">Phoenix</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading deals...</div>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {selectedCity ? 'No deals found in this city.' : 'Please select a city to view deals.'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map(offer => (
              <OfferCard key={offer.offerId} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
