
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
      
      const allOffersQuery = query(
        collection(db, 'offers'),
        orderBy('createdAt', 'desc')
      );
      const allOffersSnapshot = await getDocs(allOffersQuery);
      console.log('Total offers in database:', allOffersSnapshot.docs.length);
      
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

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.businessName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (authLoading) {
    return (
      <div className="mobile-full-height bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center android-app">
        <div className="text-center text-white px-6">
          <div className="loading-spinner h-12 w-12 mx-auto mb-6"></div>
          <p className="text-mobile-lg font-medium">Loading LocalDeal...</p>
        </div>
      </div>
    );
  }

  if (!user || !showWelcome) {
    return (
      <div className="mobile-full-height bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white overflow-hidden android-app">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white opacity-10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white opacity-5 rounded-full animate-spin"></div>
        </div>

        <div className="relative z-10 mobile-full-height flex flex-col safe-top safe-bottom">
          <div className="flex-1 flex flex-col justify-center px-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-6 animate-bounce">🏪</div>
              <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                LocalDeal
              </h1>
              <p className="text-mobile-xl font-light opacity-90 mb-2">
                Discover Amazing Local Deals
              </p>
              <p className="text-base opacity-75">
                Connect with trusted businesses in your neighborhood
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="mobile-card bg-white/10 backdrop-blur-md border border-white/20 p-6">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-mobile-lg font-bold mb-2">Local Deals</h3>
                <p className="text-white/80">Find exclusive offers from businesses in your city</p>
              </div>

              <div className="mobile-card bg-white/10 backdrop-blur-md border border-white/20 p-6">
                <div className="text-3xl mb-3">💝</div>
                <h3 className="text-mobile-lg font-bold mb-2">Save Money</h3>
                <p className="text-white/80">Get amazing discounts and cashback offers</p>
              </div>

              <div className="mobile-card bg-white/10 backdrop-blur-md border border-white/20 p-6">
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="text-mobile-lg font-bold mb-2">Support Local</h3>
                <p className="text-white/80">Help local businesses grow in your community</p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-yellow-400 to-pink-500 active:from-yellow-500 active:to-pink-600 text-white font-bold py-5 px-8 rounded-2xl text-mobile-lg shadow-2xl transform active:scale-95 transition-all duration-200 touch-manipulation"
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

  return (
    <div className="mobile-min-height bg-gray-50 android-app">
      <Navbar />

      <main className="pb-24 safe-bottom">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 safe-top">
          <div className="text-center">
            <h1 className="text-mobile-2xl font-bold mb-2">
              LocalDeal
            </h1>
            <p className="text-mobile-lg opacity-90 mb-6">
              Welcome back, {user.name || 'User'}!
            </p>
            
            <div className="mobile-card bg-white/10 backdrop-blur-md border border-white/20 p-4">
              <label className="block text-sm font-medium mb-3 opacity-90">
                📍 Your Location
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-base"
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
            <div className="mobile-search">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="🔍 Search deals, businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field text-base"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="select-field text-base"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white px-4 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-mobile-lg font-bold text-gray-900">
                  🏪 Deals in {selectedCity}
                </h2>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {filteredOffers.length} deals
                  </span>
                  <button
                    onClick={() => fetchOffers()}
                    className="touch-target text-gray-600 active:text-blue-600 active:bg-blue-50 rounded-xl transition-colors duration-150"
                  >
                    🔄
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="text-center py-20">
                  <div className="loading-spinner h-12 w-12 mx-auto mb-6"></div>
                  <p className="text-gray-600 font-medium text-mobile-lg">Loading deals...</p>
                </div>
              ) : filteredOffers.length > 0 ? (
                <div className="space-y-4">
                  {filteredOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 mobile-card p-8">
                  <div className="text-5xl mb-6">
                    {searchTerm || selectedCategory !== 'all' ? '🔍' : '🎯'}
                  </div>
                  <h3 className="text-mobile-xl font-bold text-gray-900 mb-3">
                    {searchTerm || selectedCategory !== 'all' 
                      ? 'No matching deals found' 
                      : `No deals in ${selectedCity} yet`
                    }
                  </h3>
                  <p className="text-gray-600 mb-8">
                    {searchTerm || selectedCategory !== 'all'
                      ? 'Try different search terms'
                      : 'Local businesses will post deals soon!'
                    }
                  </p>
                  <div className="space-y-4">
                    {(searchTerm || selectedCategory !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                        }}
                        className="btn-primary w-full"
                      >
                        Clear Filters
                      </button>
                    )}
                    <button
                      onClick={() => fetchOffers()}
                      className="btn-secondary w-full"
                    >
                      🔄 Refresh Deals
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="mobile-card bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                <h3 className="text-mobile-lg font-bold text-gray-900 mb-4">
                  ⚡ Quick Actions
                </h3>
                <div className="space-y-4">
                  {user.role === 'owner' && (
                    <button
                      onClick={() => router.push('/owner/dashboard')}
                      className="mobile-card-interactive w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-left"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-4">📊</span>
                        <div>
                          <div className="font-bold text-gray-900">Business Dashboard</div>
                          <div className="text-sm text-gray-600">Manage your business and offers</div>
                        </div>
                      </div>
                    </button>
                  )}
                  <button
                    onClick={() => fetchOffers()}
                    className="mobile-card-interactive w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-left"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-4">🔄</span>
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
