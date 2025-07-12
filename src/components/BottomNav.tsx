
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 px-2">

        {/* Home */}
        <Link href="/" className="flex flex-col items-center justify-center h-full px-3 touch-manipulation">
          <span className="text-base mb-0.5">🏠</span>
          <span className="text-xs text-gray-600">Home</span>
        </Link>

        {/* Dashboard (for owners only) */}
        {user.role === 'owner' && (
          <Link href="/owner/dashboard" className="flex flex-col items-center justify-center h-full px-3 touch-manipulation">
            <span className="text-base mb-0.5">📊</span>
            <span className="text-xs text-gray-600">Dashboard</span>
          </Link>
        )}

        {/* Profile */}
        <div className="flex flex-col items-center justify-center h-full px-3">
          <span className="text-base mb-0.5">👤</span>
          <span className="text-xs text-gray-600 truncate max-w-[50px]">{user.name?.split(' ')[0]}</span>
        </div>

        {/* City */}
        {user.city && (
          <div className="flex flex-col items-center justify-center h-full px-3">
            <span className="text-base mb-0.5">📍</span>
            <span className="text-xs text-gray-600 truncate max-w-[50px]">{user.city}</span>
          </div>
        )}

        {/* Logout */}
        <button onClick={handleLogout} className="flex flex-col items-center justify-center h-full px-3 touch-manipulation">
          <span className="text-base mb-0.5">🚪</span>
          <span className="text-xs text-gray-600">Logout</span>
        </button>

      </div>
    </div>
  );
}
