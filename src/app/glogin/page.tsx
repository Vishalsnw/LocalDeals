
'use client';

import { useEffect, useState } from 'react';
import { signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function GoogleLogin() {
  const [message, setMessage] = useState('Signing you in...');

  useEffect(() => {
    const handleGoogleSignIn = async () => {
      try {
        // Check if there's a redirect result first
        const result = await getRedirectResult(auth);
        
        if (result) {
          // User just completed sign-in, redirect to success page
          window.location.href = 'https://local-deals-um8q.vercel.app/login-success';
          return;
        }

        // No redirect result, initiate sign-in
        const provider = new GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
        
        // Trigger the redirect sign-in
        await signInWithRedirect(auth, provider);
        
      } catch (error) {
        console.error('Error during sign-in:', error);
        setMessage('Sign-in failed. Please try again.');
      }
    };

    handleGoogleSignIn();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-medium text-gray-800">{message}</h1>
        <p className="text-gray-600 mt-2">Please wait while we redirect you to Google...</p>
      </div>
    </div>
  );
}
