'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleLogin() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main login page since we no longer use Google auth
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-medium text-gray-800">Redirecting...</h1>
      </div>
    </div>
  );
}