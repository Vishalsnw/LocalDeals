'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

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

        {/* Profile Indicator */}
        <div className="flex flex-col items-center space-y-1 text-blue-600 justify-center h-full px-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs">{user?.role === 'owner' ? 'Owner' : 'Customer'}</span>
        </div>

      </div>
    </div>
  );
}