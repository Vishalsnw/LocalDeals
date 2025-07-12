
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function BottomNav() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 h-16">
      <div className="flex justify-around items-center h-full px-2">

        {/* Home */}
        <Link href="/" className="flex flex-col items-center justify-center h-full px-3 touch-manipulation">
          <span className="text-base mb-0.5">🏠</span>
          <span className="text-xs text-gray-600">Home</span>
        </Link>

        {/* Dashboard (for owners) */}
        {user.role === 'owner' && (
          <Link href="/owner/dashboard" className="flex flex-col items-center justify-center h-full px-3 touch-manipulation">
            <span className="text-base mb-0.5">📊</span>
            <span className="text-xs text-gray-600">Dashboard</span>
          </Link>
        )}

        {/* Profile/City */}
        <div className="flex flex-col items-center justify-center h-full px-3">
          <span className="text-base mb-0.5">📍</span>
          <span className="text-xs text-gray-600 truncate max-w-[50px]">{user.city}</span>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="flex flex-col items-center justify-center h-full px-3 touch-manipulation">
          <span className="text-base mb-0.5">🚪</span>
          <span className="text-xs text-gray-600">Logout</span>
        </button>

      </div>
    </div>
  );
}
