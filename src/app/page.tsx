'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Offer } from '@/types';
import BottomNav from '@/components/BottomNav';
import Navbar from '@/components/Navbar';
import OfferCard from '@/components/OfferCard';

export default function Home() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showAddCity, setShowAddCity] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [newCityState, setNewCityState] = useState('');
  const [availableCities, setAvailableCities] = useState([
    { id: '1', name: 'Mumbai', state: 'Maharashtra', isCustom: false },
    { id: '2', name: 'Delhi', state: 'Delhi', isCustom: false },
    { id: '3', name: 'Bangalore', state: 'Karnataka', isCustom: false },
    { id: '4', name: 'Hyderabad', state: 'Telangana', isCustom: false },
    { id: '5', name: 'Chennai', state: 'Tamil Nadu', isCustom: false },
    { id: '6', name: 'Kolkata', state: 'West Bengal', isCustom: false },
  ]);

  const categories = [
    'Food & Dining',
    'Shopping',
    'Entertainment',
    'Health & Beauty',
    'Services',
    'Travel',
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports & Fitness'
  ];

  useEffect(() => {
    if (user?.city) {
      setSelectedCity(user.city);
    }
  }, [user]);

  useEffect(() => {
    fetchOffers();
  }, [selectedCity, selectedCategory]);

  const fetchOffers = async () => {
    try {
      setLoading(true);

      // Build the query conditions array
      const conditions = [];

      if (selectedCity) {
        conditions.push(where('location', '==', selectedCity));
      }

      if (selectedCategory) {
        conditions.push(where('category', '==', selectedCategory));
      }

      // Create the query with all conditions
      let q;
      if (conditions.length > 0) {
        q = query(
          collection(db, 'offers'),
          ...conditions,
          orderBy('createdAt', 'desc')
        );
      } else {
        q = query(
          collection(db, 'offers'),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      const offersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Offer[];

      setOffers(offersData);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCustomCity = () => {
    if (newCityName.trim() && newCityState.trim()) {
      const newCity = {
        id: Date.now().toString(),
        name: newCityName.trim(),
        state: newCityState.trim(),
        isCustom: true
      };
      setAvailableCities([...availableCities, newCity]);
      setSelectedCity(newCity.name);
      setNewCityName('');
      setNewCityState('');
      setShowAddCity(false);
    }
  };

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to LocalDeal</h1>
          <p className="text-gray-600 mb-6">Please sign in to continue</p>
          <a href="/login" className="btn-primary">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mobile-app">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Local Deals
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Find the best offers from businesses in your city
          </p>

          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{offers.length}</div>
              <div className="text-sm text-gray-600">Active Deals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">50+</div>
              <div className="text-sm text-gray-600">Local Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">1000+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 animate-slideInLeft">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search deals, businesses, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:col-span-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🏷️</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="select-field pl-10"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* City Selection */}
            <div className="lg:col-span-1">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📍</span>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="select-field pl-10"
                  >
                    <option value="">All Cities</option>
                    {availableCities.map(city => (
                      <option key={city.id} value={city.name}>
                        {city.name}, {city.state} {city.isCustom && '(Custom)'}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setShowAddCity(true)}
                  className="btn-secondary px-3"
                  title="Add custom city"
                >
                  ➕
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory || selectedCity) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategory && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  🏷️ {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedCity && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  📍 {selectedCity}
                  <button
                    onClick={() => setSelectedCity('')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading amazing deals...</p>
          </div>
        )}

        {/* Offers Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slideInRight">
            {filteredOffers.length > 0 ? (
              filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals found</h3>
                <p className="text-gray-600">
                  {searchTerm || selectedCategory || selectedCity
                    ? 'Try adjusting your search criteria'
                    : 'Check back later for new deals!'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Custom City Modal */}
      {showAddCity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add Custom City</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
                <input
                  type="text"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  className="input-field"
                  placeholder="Enter city name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={newCityState}
                  onChange={(e) => setNewCityState(e.target.value)}
                  className="input-field"
                  placeholder="Enter state name"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddCity(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={addCustomCity}
                disabled={!newCityName.trim() || !newCityState.trim()}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add City
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}