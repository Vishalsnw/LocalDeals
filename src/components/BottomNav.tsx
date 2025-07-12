
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function BottomNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center py-3">
          
          {/* Home */}
          <Link href="/" className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-xl">🏠</span>
            <span className="text-xs text-gray-600 font-medium">Home</span>
          </Link>

          {/* Search */}
          <button className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-xl">🔍</span>
            <span className="text-xs text-gray-600 font-medium">Search</span>
          </button>

          {/* Dashboard (for owners only) */}
          {user.role === 'owner' && (
            <Link href="/owner/dashboard" className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-xl">📊</span>
              <span className="text-xs text-gray-600 font-medium">Dashboard</span>
            </Link>
          )}

          {/* Profile */}
          <div className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-xl">👤</span>
            <span className="text-xs text-gray-600 font-medium">Profile</span>
            <div className="bg-blue-100 px-2 py-1 rounded-full">
              <span className="text-xs text-blue-800 font-semibold">{user.name}</span>
            </div>
            {user.city && (
              <div className="flex items-center space-x-1">
                <span className="text-xs">📍</span>
                <span className="text-xs text-gray-500">{user.city}</span>
              </div>
            )}
          </div>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <span className="text-xl">🚪</span>
            <span className="text-xs text-gray-600 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
