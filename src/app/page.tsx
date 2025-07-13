'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Offer } from '@/types';
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

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
    'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur'
  ];

  useEffect(() => {
    if (user?.city) {
      setSelectedCity(user.city);
    }

    // Persist selected city in local storage
    const storedCity = localStorage.getItem('selectedCity');
    if (storedCity) {
      setSelectedCity(storedCity);
    }
  }, [user]);

  useEffect(() => {
    fetchOffers();
    // Persist selected city in local storage
    localStorage.setItem('selectedCity', selectedCity);
  }, [selectedCity, selectedCategory]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      let q = query(
        collection(db, 'offers'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      let offersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Offer[];

      if (selectedCity) {
        offersData = offersData.filter(offer => 
          offer.location === selectedCity
        );
      }

      if (selectedCategory) {
        offersData = offersData.filter(offer => 
          offer.category === selectedCategory
        );
      }

      setOffers(offersData);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setOffers([]);
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
    (offer.businessName && offer.businessName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🛍️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">LocalDeal</h1>
            <p className="text-gray-600 mb-8">Discover amazing local deals in your city</p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">💰</span>
                </div>
                <p className="text-sm text-gray-600">Save Money</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🏪</span>
                </div>
                <p className="text-sm text-gray-600">Local Business</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">⚡</span>
                </div>
                <p className="text-sm text-gray-600">Instant Access</p>
              </div>
            </div>
            <a href="/login" className="btn-primary w-full">
              Get Started
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header with Search */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter Chips */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{offers.length}</div>
            <div className="text-sm text-gray-600">Active Deals</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">50+</div>
            <div className="text-sm text-gray-600">Businesses</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">1000+</div>
            <div className="text-sm text-gray-600">Users</div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Offers Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOffers.length > 0 ? (
              filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))
            ) : (
              <div className="col-span-full bg-white rounded-lg p-12 text-center shadow-sm">
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
    </div>
  );
}