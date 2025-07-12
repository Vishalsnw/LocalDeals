'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold gradient-text">LocalDeal</span>
          </Link>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-sm text-gray-600">Welcome,</span>
              <span className="font-medium text-gray-900">{user.name}</span>
              {user.city && (
                <span className="city-badge">{user.city}</span>
              )}
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-2">
              {user.role === 'owner' && (
                <Link
                  href="/owner/dashboard"
                  className="btn-secondary text-sm"
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={logout}
                className="btn-danger text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}