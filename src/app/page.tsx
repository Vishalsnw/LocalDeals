'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Offer, CATEGORIES, INDIAN_CITIES, City } from '@/types';
import Navbar from '@/components/Navbar';
import OfferCard from '@/components/OfferCard';
import { FiSearch, FiFilter, FiPlus, FiMapPin, FiTrendingUp, FiUsers, FiStar } from 'react-icons/fi';

export default function Home() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddCity, setShowAddCity] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [newCityState, setNewCityState] = useState('');
  const [availableCities, setAvailableCities] = useState<City[]>([]);

  useEffect(() => {
    // Initialize with Indian cities
    const initialCities: City[] = INDIAN_CITIES.map((city, index) => ({
      id: `indian-${index}`,
      name: city.name,
      state: city.state,
      isCustom: false
    }));
    setAvailableCities(initialCities);
  }, []);

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

  const addCustomCity = async () => {
    if (!newCityName.trim() || !newCityState.trim()) return;

    try {
      const newCity: City = {
        id: `custom-${Date.now()}`,
        name: newCityName.trim(),
        state: newCityState.trim(),
        isCustom: true,
        createdBy: user?.userId
      };

      // Add to Firestore
      await addDoc(collection(db, 'cities'), newCity);

      // Add to local state
      setAvailableCities(prev => [...prev, newCity]);
      setSelectedCity(newCity.name);
      setShowAddCity(false);
      setNewCityName('');
      setNewCityState('');
    } catch (error) {
      console.error('Error adding custom city:', error);
    }
  };

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { icon: FiTrendingUp, label: 'Active Deals', value: filteredOffers.length, color: 'text-blue-600' },
    { icon: FiUsers, label: 'Local Businesses', value: new Set(offers.map(o => o.businessId)).size, color: 'text-green-600' },
    { icon: FiStar, label: 'Categories', value: new Set(offers.map(o => o.category)).size, color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Discover Amazing
              <span className="block gradient-text">Local Deals</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Find the best offers from local businesses in your city. Save money while supporting your community.
            </p>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="glass-card p-6 text-center">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            {/* Search */}
            <div className="lg:col-span-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* City Selection */}
            <div className="lg:col-span-1">
              <div className="flex space-x-2">
                <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📍</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="select-field flex-1"
                >
                  <option value="">Choose a city</option>
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
                  <FiPlus />
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:col-span-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔽</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option></select>
              </div>
            </div>

            {/* Filter Button */}
            <div className="lg:col-span-1">
              <button
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <FiFilter />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4 shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
                </div>
              ))}
            </div>
          ) : filteredOffers.length === 0 ? (
            <div
              className="text-center py-20"
            >
              <FiMapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">No deals found</h3>
              <p className="text-white/70 max-w-md mx-auto">
                {selectedCity ? 'No deals available in this city yet. Check back soon!' : 'Please select a city to view deals.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOffers.map((offer, index) => (
                <OfferCard key={offer.offerId} offer={offer} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add City Modal */}
      {showAddCity && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div
            className="floating-card max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold mb-4">Add Custom City</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City Name
                </label>
                <input
                  type="text"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  className="input-field"
                  placeholder="Enter city name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
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