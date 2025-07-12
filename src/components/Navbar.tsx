'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 touch-manipulation">
              <div className="flex items-center space-x-1">
                <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs">📈</span>
                </div>
                <span className="text-lg font-bold gradient-text">LocalDeal</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 text-gray-700 text-xs">
                  <span className="text-blue-600">👤</span>
                  <span className="font-medium">{user.name?.split(' ')[0]}</span>
                </div>

                {user.city && (
                  <div className="hidden sm:flex items-center space-x-1">
                    <span className="text-blue-600 text-xs">📍</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                      {user.city}
                    </span>
                  </div>
                )}

                {user.role === 'owner' && (
                  <div className="hidden sm:block">
                    <Link href="/owner/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 px-3 rounded-md font-medium transition-colors">
                      Dashboard
                    </Link>
                  </div>
                )}

                <button 
                  onClick={logout} 
                  className="hidden sm:flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-1.5 px-3 rounded-md transition-colors"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div>
                <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-4 rounded-md font-medium transition-colors">
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
```

```replit_final_file
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 touch-manipulation">
              <div className="flex items-center space-x-1">
                <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs">📈</span>
                </div>
                <span className="text-lg font-bold gradient-text">LocalDeal</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 text-gray-700 text-xs">
                  <span className="text-blue-600">👤</span>
                  <span className="font-medium">{user.name?.split(' ')[0]}</span>
                </div>

                {user.city && (
                  <div className="hidden sm:flex items-center space-x-1">
                    <span className="text-blue-600 text-xs">📍</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                      {user.city}
                    </span>
                  </div>
                )}

                {user.role === 'owner' && (
                  <div className="hidden sm:block">
                    <Link href="/owner/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 px-3 rounded-md font-medium transition-colors">
                      Dashboard
                    </Link>
                  </div>
                )}

                <button 
                  onClick={logout} 
                  className="hidden sm:flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-1.5 px-3 rounded-md transition-colors"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div>
                <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-4 rounded-md font-medium transition-colors">
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