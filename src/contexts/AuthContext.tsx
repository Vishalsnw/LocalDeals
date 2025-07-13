
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInAnonymously: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: 'user' | 'owner', city: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Always try Firestore first for the most up-to-date data
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
            // Update localStorage with latest data from Firestore
            localStorage.setItem(`user_${firebaseUser.uid}`, JSON.stringify(userData));
          } else {
            // No Firestore data found, check localStorage as fallback
            const savedUser = localStorage.getItem(`user_${firebaseUser.uid}`);
            if (savedUser) {
              try {
                const userData = JSON.parse(savedUser) as User;
                // Validate that the saved data is complete
                if (userData.role && userData.city && userData.userId) {
                  setUser(userData);
                  // Restore complete data to Firestore
                  await setDoc(doc(db, 'users', firebaseUser.uid), userData);
                } else {
                  setUser(null);
                }
              } catch (parseError) {
                console.error('Error parsing saved user data:', parseError);
                // Clear corrupted data
                localStorage.removeItem(`user_${firebaseUser.uid}`);
                setUser(null);
              }
            } else {
              // No data found anywhere, user needs to complete profile
              setUser(null);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to localStorage only if Firestore fails
          const savedUser = localStorage.getItem(`user_${firebaseUser.uid}`);
          if (savedUser) {
            try {
              const userData = JSON.parse(savedUser) as User;
              if (userData.role && userData.city && userData.userId) {
                setUser(userData);
              } else {
                setUser(null);
              }
            } catch (parseError) {
              console.error('Error parsing fallback user data:', parseError);
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInAnonymouslyHandler = async () => {
    await signInAnonymously(auth);
  };

  const logout = async () => {
    if (firebaseUser) {
      // Clear localStorage for this user
      localStorage.removeItem(`user_${firebaseUser.uid}`);
    }
    await signOut(auth);
  };

  const updateUserRole = async (role: 'user' | 'owner', city: string, name?: string) => {
    if (!firebaseUser) {
      throw new Error('No authenticated user found');
    }

    const userData: User = {
      userId: firebaseUser.uid,
      name: name || `${role === 'owner' ? 'Business Owner' : 'Customer'} ${firebaseUser.uid.slice(-6)}`,
      email: `anonymous-${firebaseUser.uid}@local.app`,
      role,
      city,
    };

    try {
      // Save to Firestore first (primary storage)
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      // Update local state
      setUser(userData);
      
      // Save to localStorage as backup/cache
      localStorage.setItem(`user_${firebaseUser.uid}`, JSON.stringify(userData));
      
      console.log('User profile saved successfully:', { role, city, name });
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      
      // If Firestore fails, still save to localStorage and update state
      localStorage.setItem(`user_${firebaseUser.uid}`, JSON.stringify(userData));
      setUser(userData);
      
      // Rethrow to let calling component know about the error
      throw new Error('Failed to save user profile to database, but saved locally');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      loading,
      signInAnonymously: signInAnonymouslyHandler,
      logout,
      updateUserRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
