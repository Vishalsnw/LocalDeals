
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
  const [showWelcome, setShowWelcome] = useState(false);

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

  const handleGetStarted = () => {
    if (!user) {
      router.push('/login');
    } else {
      setShowWelcome(true);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setShowWelcome(false);
      return;
    }

    // Set city from user profile or localStorage
    if (user?.city) {
      setSelectedCity(user.city);
      setShowWelcome(true);
    } else {
      const storedCity = localStorage.getItem('selectedCity');
      if (storedCity) {
        setSelectedCity(storedCity);
        setShowWelcome(true);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
          <p className="text-lg font-medium">Loading LocalDeal...</p>
        </div>
      </div>
    );
  }

  // Welcome/Landing screen for non-authenticated users
  if (!user || !showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white overflow-hidden relative">
        {/* Animated background patterns */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white opacity-5 rounded-full animate-spin"></div>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 pt-16 px-6 text-center">
            <div className="mb-8">
              <div className="text-7xl mb-4 animate-bounce">🏪</div>
              <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                LocalDeal
              </h1>
              <p className="text-xl md:text-2xl font-light opacity-90 mb-2">
                Discover Amazing Local Deals
              </p>
              <p className="text-base opacity-75">
                Connect with trusted businesses in your neighborhood
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="flex-1 px-6 py-8">
            <div className="max-w-md mx-auto space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-bold mb-2">Local Deals</h3>
                <p className="text-white/80">Find exclusive offers from businesses in your city</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl mb-3">💝</div>
                <h3 className="text-xl font-bold mb-2">Save Money</h3>
                <p className="text-white/80">Get amazing discounts and cashback offers</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="text-xl font-bold mb-2">Support Local</h3>
                <p className="text-white/80">Help local businesses grow in your community</p>
              </div>
            </div>
          </div>

          {/* Get Started Button */}
          <div className="flex-shrink-0 p-6 pb-8">
            <button
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 active:scale-95"
            >
              🚀 Get Started
            </button>
            <p className="text-center text-white/60 text-sm mt-4">
              Start discovering deals in your city
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main app content for authenticated users
  return (
    <div className="min-h-screen bg-gray-50 android-app">
      <Navbar />

      <main className="pb-20">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              LocalDeal
            </h1>
            <p className="text-lg opacity-90 mb-4">
              Welcome back, {user.name || 'User'}!
            </p>
            
            {/* City Selection */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <label className="block text-sm font-medium mb-2 opacity-90">
                📍 Your Location
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="" className="text-gray-800">Choose your city...</option>
                {cities.map((city) => (
                  <option key={city} value={city} className="text-gray-800">
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {selectedCity && (
          <>
            {/* Search and Filter */}
            <div className="p-4 bg-white shadow-sm">
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="🔍 Search deals, businesses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />
                </div>
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
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

            {/* Stats Bar */}
            <div className="bg-white px-4 py-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  🏪 Deals in {selectedCity}
                </h2>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {filteredOffers.length} deals
                  </span>
                  <button
                    onClick={() => fetchOffers()}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    🔄
                  </button>
                </div>
              </div>
            </div>

            {/* Offers Grid */}
            <div className="p-4">
              {loading ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading deals...</p>
                </div>
              ) : filteredOffers.length > 0 ? (
                <div className="space-y-4">
                  {filteredOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl">
                  <div className="text-6xl mb-6">
                    {searchTerm || selectedCategory !== 'all' ? '🔍' : '🎯'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {searchTerm || selectedCategory !== 'all' 
                      ? 'No matching deals found' 
                      : `No deals in ${selectedCity} yet`
                    }
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || selectedCategory !== 'all'
                      ? 'Try different search terms'
                      : 'Local businesses will post deals soon!'
                    }
                  </p>
                  <div className="space-y-3">
                    {(searchTerm || selectedCategory !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium"
                      >
                        Clear Filters
                      </button>
                    )}
                    <button
                      onClick={() => fetchOffers()}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-medium"
                    >
                      Refresh Deals
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  ⚡ Quick Actions
                </h3>
                <div className="space-y-3">
                  {user.role === 'owner' && (
                    <button
                      onClick={() => router.push('/owner/dashboard')}
                      className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-left hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">📊</span>
                        <div>
                          <div className="font-bold text-gray-900">Business Dashboard</div>
                          <div className="text-sm text-gray-600">Manage your business and offers</div>
                        </div>
                      </div>
                    </button>
                  )}
                  <button
                    onClick={() => fetchOffers()}
                    className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-left hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🔄</span>
                      <div>
                        <div className="font-bold text-gray-900">Refresh Deals</div>
                        <div className="text-sm text-gray-600">Get latest offers from businesses</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
