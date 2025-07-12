
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-white/20 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 touch-manipulation">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📈</span>
                </div>
                <span className="text-xl font-bold gradient-text">LocalDeal</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 text-gray-700">
                  <span className="text-blue-600 text-sm">👤</span>
                  <span className="font-medium text-sm">Hi, {user.name?.split(' ')[0]}</span>
                </div>

                {user.city && (
                  <div className="hidden sm:flex items-center space-x-1">
                    <span className="text-blue-600 text-sm">📍</span>
                    <span className="city-badge text-xs">{user.city}</span>
                  </div>
                )}

                {user.role === 'owner' && (
                  <div className="hidden sm:block">
                    <Link href="/owner/dashboard" className="btn-primary text-sm py-1 px-3">
                      Dashboard
                    </Link>
                  </div>
                )}

                <button 
                  onClick={logout} 
                  className="hidden sm:flex items-center space-x-1 btn-secondary text-sm py-1 px-3"
                >
                  <span className="text-sm">🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div>
                <Link href="/login" className="btn-primary text-sm py-2 px-4">
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
