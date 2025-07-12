'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const { user, firebaseUser, signInWithGoogle, updateUserRole } = useAuth();
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'user' | 'owner'>('user');
  const [selectedCity, setSelectedCity] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    } else if (firebaseUser && !user) {
      setShowRoleSelection(true);
    }
  }, [user, firebaseUser, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleRoleSubmit = async () => {
    if (!selectedCity) return;

    try {
      await updateUserRole(selectedRole, selectedCity);
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a:
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="user"
                    checked={selectedRole === 'user'}
                    onChange={(e) => setSelectedRole(e.target.value as 'user')}
                    className="mr-2"
                  />
                  User - I want to browse deals
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="owner"
                    checked={selectedRole === 'owner'}
                    onChange={(e) => setSelectedRole(e.target.value as 'owner')}
                    className="mr-2"
                  />
                  Business Owner - I want to post deals
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Your City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a city</option>
                <option value="Mumbai">Mumbai, Maharashtra</option>
                <option value="Delhi">Delhi, Delhi</option>
                <option value="Bangalore">Bangalore, Karnataka</option>
                <option value="Hyderabad">Hyderabad, Telangana</option>
                <option value="Chennai">Chennai, Tamil Nadu</option>
                <option value="Kolkata">Kolkata, West Bengal</option>
                <option value="Pune">Pune, Maharashtra</option>
                <option value="Ahmedabad">Ahmedabad, Gujarat</option>
                <option value="Surat">Surat, Gujarat</option>
                <option value="Jaipur">Jaipur, Rajasthan</option>
                <option value="Lucknow">Lucknow, Uttar Pradesh</option>
                <option value="Kanpur">Kanpur, Uttar Pradesh</option>
                <option value="Nagpur">Nagpur, Maharashtra</option>
                <option value="Indore">Indore, Madhya Pradesh</option>
                <option value="Thane">Thane, Maharashtra</option>
                <option value="Bhopal">Bhopal, Madhya Pradesh</option>
                <option value="Visakhapatnam">Visakhapatnam, Andhra Pradesh</option>
                <option value="Vadodara">Vadodara, Gujarat</option>
                <option value="Ludhiana">Ludhiana, Punjab</option>
                <option value="Rajkot">Rajkot, Gujarat</option>
                <option value="Agra">Agra, Uttar Pradesh</option>
                <option value="Nashik">Nashik, Maharashtra</option>
                <option value="Faridabad">Faridabad, Haryana</option>
                <option value="Patiala">Patiala, Punjab</option>
                <option value="Ghaziabad">Ghaziabad, Uttar Pradesh</option>
                <option value="Coimbatore">Coimbatore, Tamil Nadu</option>
                <option value="Madurai">Madurai, Tamil Nadu</option>
                <option value="Jabalpur">Jabalpur, Madhya Pradesh</option>
                <option value="Kochi">Kochi, Kerala</option>
                <option value="Jodhpur">Jodhpur, Rajasthan</option>
                <option value="Guwahati">Guwahati, Assam</option>
                <option value="Chandigarh">Chandigarh, Chandigarh</option>
                <option value="Thiruvananthapuram">Thiruvananthapuram, Kerala</option>
                <option value="Mysore">Mysore, Karnataka</option>
                <option value="Gurgaon">Gurgaon, Haryana</option>
                <option value="Bhubaneswar">Bhubaneswar, Odisha</option>
              </select>
            </div>

            <button
              onClick={handleRoleSubmit}
              disabled={!selectedCity}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete Setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="card max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">LocalDeal</h1>
        <p className="text-gray-600 mb-8">Find amazing deals from local businesses</p>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}