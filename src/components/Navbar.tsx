
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏪</span>
            <span className="text-xl font-bold gradient-text">LocalDeal</span>
          </Link>

          {user && (
            <div className="flex items-center space-x-6">
              {user.role === 'owner' && (
                <Link 
                  href="/owner/dashboard" 
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
              )}

              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm text-gray-600">Welcome,</span>
                <span className="font-medium text-gray-900">{user.name}</span>
                {user.city && (
                  <span className="city-badge">{user.city}</span>
                )}
              </div>

              <button
                onClick={logout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
