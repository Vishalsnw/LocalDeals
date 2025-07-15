
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
  const { user, loading: authLoading } = useAuth();
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
    if (!selectedCity || !user) return;
    
    setLoading(true);
    try {
      console.log('Fetching offers for city:', selectedCity);
      
      // First, try to fetch all offers without city filter to see if there are any
      const allOffersQuery = query(
        collection(db, 'offers'),
        orderBy('createdAt', 'desc')
      );
      const allOffersSnapshot = await getDocs(allOffersQuery);
      console.log('Total offers in database:', allOffersSnapshot.docs.length);
      
      // Then fetch offers for the selected city
      const offersQuery = query(
        collection(db, 'offers'),
        where('location', '==', selectedCity),
        orderBy('createdAt', 'desc')
      );
      const offersSnapshot = await getDocs(offersQuery);
      console.log('Offers for', selectedCity, ':', offersSnapshot.docs.length);
      
      const offersData = offersSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Offer data:', data);
        return {
          id: doc.id,
          ...data
        } as Offer;
      });

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
      console.log('Set offers:', offersData.length, 'businesses:', businessesData.length);
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
    if (selectedCity && user) {
      fetchOffers();
      localStorage.setItem('selectedCity', selectedCity);
    }
  }, [selectedCity, selectedCategory, user]);

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
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LocalDeal
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Discover Exclusive Local Deals
            </p>
            <p className="text-base text-gray-500">
              Connect with trusted businesses in your neighborhood
            </p>
          </div>

          {/* City Selection */}
          <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              📍 Select Your City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 font-medium transition-all duration-200"
            >
              <option value="">Choose your city...</option>
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
            <div className="mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      🔍 Search Deals
                    </label>
                    <input
                      type="text"
                      placeholder="Search for deals, businesses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      🏷️ Filter by Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all duration-200"
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
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 bg-white p-4 rounded-lg shadow-sm border">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">
                  🏪 Local Deals in {selectedCity}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {filteredOffers.length} {filteredOffers.length === 1 ? 'deal' : 'deals'} available
                  </div>
                  <button
                    onClick={() => fetchOffers()}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="Refresh deals"
                  >
                    🔄
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600 font-medium">Loading amazing deals for you...</p>
                </div>
              ) : filteredOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
                  <div className="text-6xl mb-6">
                    {searchTerm || selectedCategory !== 'all' ? '🔍' : '🎯'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {searchTerm || selectedCategory !== 'all' 
                      ? 'No matching deals found' 
                      : `No deals available in ${selectedCity} yet`
                    }
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchTerm || selectedCategory !== 'all'
                      ? 'Try adjusting your search terms or browse different categories'
                      : 'Local businesses will start posting amazing deals soon. Check back regularly!'
                    }
                  </p>
                  <div className="space-x-3">
                    {(searchTerm || selectedCategory !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm"
                      >
                        Clear Filters
                      </button>
                    )}
                    <button
                      onClick={() => fetchOffers()}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm"
                    >
                      Refresh Deals
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg border border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                ⚡ Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.role === 'owner' && (
                  <button
                    onClick={() => router.push('/owner/dashboard')}
                    className="group p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-300 transition-all duration-300 text-left"
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">📊</div>
                    <div className="font-bold text-gray-900 mb-1">Business Dashboard</div>
                    <div className="text-sm text-gray-600">Manage your business and create offers</div>
                  </button>
                )}
                <button
                  onClick={() => fetchOffers()}
                  className="group p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-green-300 transition-all duration-300 text-left"
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">🔄</div>
                  <div className="font-bold text-gray-900 mb-1">Refresh Deals</div>
                  <div className="text-sm text-gray-600">Get the latest offers from local businesses</div>
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
