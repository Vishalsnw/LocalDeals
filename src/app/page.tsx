
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Offer, Business } from '@/types';
import Navbar from '@/components/Navbar';
import OfferCard from '@/components/OfferCard';

export default function HomePage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 
    'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
    'Nagpur', 'Visakhapatnam', 'Indore', 'Thane', 'Bhopal', 'Patna',
    'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
    'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi', 'Srinagar'
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Food & Dining', label: '🍔 Food & Dining' },
    { value: 'Fashion', label: '👗 Fashion' },
    { value: 'Electronics', label: '📱 Electronics' },
    { value: 'Health & Beauty', label: '💄 Beauty' },
    { value: 'Services', label: '🔧 Services' },
    { value: 'Entertainment', label: '🎬 Entertainment' },
    { value: 'Shopping', label: '🛍️ Shopping' },
    { value: 'Travel', label: '✈️ Travel' },
    { value: 'Other', label: '🎯 Other' },
  ];

  const fetchOffers = async () => {
    if (!selectedCity) return;
    
    setLoading(true);
    try {
      // Fetch offers for the selected city
      const offersQuery = query(
        collection(db, 'offers'),
        where('location', '==', selectedCity),
        orderBy('createdAt', 'desc')
      );
      const offersSnapshot = await getDocs(offersQuery);
      const offersData = offersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Offer));

      // Fetch businesses for the selected city
      const businessesQuery = query(
        collection(db, 'businesses'),
        where('location', '==', selectedCity)
      );
      const businessesSnapshot = await getDocs(businessesQuery);
      const businessesData = businessesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Business));

      setOffers(offersData);
      setBusinesses(businessesData);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    // Set city from user profile or localStorage
    if (user?.city) {
      setSelectedCity(user.city);
    } else {
      const storedCity = localStorage.getItem('selectedCity');
      if (storedCity) {
        setSelectedCity(storedCity);
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (selectedCity) {
      fetchOffers();
      localStorage.setItem('selectedCity', selectedCity);
    }
  }, [selectedCity, selectedCategory]);

  // Filter offers based on search and category
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.businessName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 mobile-app">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to LocalDeal
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover amazing deals from local businesses in your city
          </p>

          {/* City Selection */}
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a city...</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedCity && (
          <>
            {/* Search and Filter */}
            <div className="mb-6 space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Deals
                    </label>
                    <input
                      type="text"
                      placeholder="Search for deals, businesses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Offers Grid */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Available Deals in {selectedCity}
                </h2>
                <div className="text-sm text-gray-600">
                  {filteredOffers.length} deals found
                </div>
              </div>

              {filteredOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm || selectedCategory !== 'all' 
                      ? 'No deals match your search' 
                      : `No deals available in ${selectedCity}`
                    }
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedCategory !== 'all'
                      ? 'Try adjusting your search terms or filters'
                      : 'Be the first to discover amazing deals when they become available!'
                    }
                  </p>
                  {(searchTerm || selectedCategory !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.role === 'owner' && (
                  <button
                    onClick={() => router.push('/owner/dashboard')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-2xl mb-2">📊</div>
                    <div className="font-medium">Business Dashboard</div>
                    <div className="text-sm text-gray-600">Manage your business and offers</div>
                  </button>
                )}
                <button
                  onClick={() => fetchOffers()}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl mb-2">🔄</div>
                  <div className="font-medium">Refresh Deals</div>
                  <div className="text-sm text-gray-600">Get the latest offers</div>
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
