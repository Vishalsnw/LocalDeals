
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const { user, firebaseUser, signInAnonymously, updateUserRole } = useAuth();
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'user' | 'owner'>('user');
  const [selectedCity, setSelectedCity] = useState('');
  const [userName, setUserName] = useState('');
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

  useEffect(() => {
    if (user) {
      // User has complete profile, redirect to home
      router.push('/');
    } else if (firebaseUser && !user) {
      // User is authenticated but no profile data found
      // Check if we have any saved data in localStorage
      const savedUser = localStorage.getItem(`user_${firebaseUser.uid}`);
      if (savedUser) {
        // We have saved data, try to restore it
        try {
          const userData = JSON.parse(savedUser) as any;
          if (userData.role && userData.city) {
            // Complete profile exists, no need to show role selection
            router.push('/');
            return;
          }
        } catch (error) {
          console.error('Error parsing saved user data:', error);
        }
      }
      // No complete profile found, show role selection
      setShowRoleSelection(true);
    }
  }, [user, firebaseUser, router]);

  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymously();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleRoleSubmit = async () => {
    if (!selectedCity) return;

    try {
      await updateUserRole(selectedRole, selectedCity, userName || undefined);
      router.push('/');
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (showRoleSelection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (Optional)</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="input-field"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">I am a:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedRole('user')}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedRole === 'user'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  🛍️ Customer
                </button>
                <button
                  onClick={() => setSelectedRole('owner')}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedRole === 'owner'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  🏪 Business Owner
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="select-field"
              >
                <option value="">Select your city</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRoleSubmit}
              disabled={!selectedCity}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="card max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to LocalDeal</h1>
          <p className="text-gray-600">Discover amazing local deals in your city</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl mb-2">🛍️</div>
              <div className="text-sm text-gray-600">Great Deals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🏪</div>
              <div className="text-sm text-gray-600">Local Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">💝</div>
              <div className="text-sm text-gray-600">Save Money</div>
            </div>
          </div>

          <button
            onClick={handleAnonymousSignIn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Get Started
          </button>

          <p className="text-xs text-gray-500">
            No account required. Start browsing deals instantly!
          </p>
        </div>
      </div>
    </div>
  );
}
