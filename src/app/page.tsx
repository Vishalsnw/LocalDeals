
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Offer, Business } from '@/types';
import Navbar from '@/components/Navbar';
import OfferCard from '@/components/OfferCard';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const cities = [
    'Mumbai',
    'Delhi', 
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Jaipur',
    'Lucknow',
    'Kanpur'
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

  if (authLoading || loading) {
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
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Discover amazing deals in {selectedCity || 'your city'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{filteredOffers.length}</div>
            <div className="text-sm text-gray-600">Active Deals</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">{businesses.length}</div>
            <div className="text-sm text-gray-600">Businesses</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{selectedCity}</div>
            <div className="text-sm text-gray-600">Your City</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{categories.length - 1}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>

        {/* City Selection */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a city</option>
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
          </>
        )}
      </main>
    </div>
  );
}
