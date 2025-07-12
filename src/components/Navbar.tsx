'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-white/20 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">📈</span>
                </div>
                <span className="text-2xl font-bold gradient-text">LocalDeal</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-gray-700">
                  <span className="text-blue-600">👤</span>
                  <span className="font-medium">Hi, {user.name}</span>
                </div>

                {user.city && (
                  <div className="flex items-center space-x-1">
                    <span className="text-blue-600 text-sm">📍</span>
                    <span className="city-badge">{user.city}</span>
                  </div>
                )}

                {user.role === 'owner' && (
                  <div>
                    <Link href="/owner/dashboard" className="btn-primary">
                      Dashboard
                    </Link>
                  </div>
                )}

                <button 
                  onClick={logout} 
                  className="flex items-center space-x-1 btn-secondary"
                >
                  <span className="text-sm">🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div>
                <Link href="/login" className="btn-primary">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}