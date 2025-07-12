
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
      <div className="flex justify-around items-center py-2 px-4">
        
        {/* Home */}
        <Link href="/" className="flex flex-col items-center space-y-1 p-2 min-w-[60px] touch-manipulation">
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-lg">🏠</span>
          </div>
          <span className="text-xs text-gray-600 font-medium">Home</span>
        </Link>

        {/* Dashboard (for owners only) */}
        {user.role === 'owner' && (
          <Link href="/owner/dashboard" className="flex flex-col items-center space-y-1 p-2 min-w-[60px] touch-manipulation">
            <div className="w-6 h-6 flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">Dashboard</span>
          </Link>
        )}

        {/* Profile */}
        <div className="flex flex-col items-center space-y-1 p-2 min-w-[60px] touch-manipulation">
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <span className="text-xs text-gray-600 font-medium">Profile</span>
          <div className="bg-blue-100 px-2 py-0.5 rounded-full max-w-[50px]">
            <span className="text-xs text-blue-800 font-semibold truncate block">{user.name?.split(' ')[0]}</span>
          </div>
        </div>

        {/* City */}
        {user.city && (
          <div className="flex flex-col items-center space-y-1 p-2 min-w-[60px] touch-manipulation">
            <div className="w-6 h-6 flex items-center justify-center">
              <span className="text-lg">📍</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">City</span>
            <span className="text-xs text-gray-500 truncate max-w-[50px] block">{user.city}</span>
          </div>
        )}

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="flex flex-col items-center space-y-1 p-2 min-w-[60px] touch-manipulation hover:bg-red-50 rounded-lg transition-colors"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-lg">🚪</span>
          </div>
          <span className="text-xs text-gray-600 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
