
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
          // Try to get user data from Firestore first
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
            // Also save to localStorage for quick access
            localStorage.setItem(`user_${firebaseUser.uid}`, JSON.stringify(userData));
          } else {
            // If no Firestore data, try to get from localStorage
            const savedUser = localStorage.getItem(`user_${firebaseUser.uid}`);
            if (savedUser) {
              const userData = JSON.parse(savedUser) as User;
              setUser(userData);
              // Restore to Firestore
              await setDoc(doc(db, 'users', firebaseUser.uid), userData);
            } else {
              setUser(null);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to localStorage
          const savedUser = localStorage.getItem(`user_${firebaseUser.uid}`);
          if (savedUser) {
            setUser(JSON.parse(savedUser) as User);
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
    if (!firebaseUser) return;

    const userData: User = {
      userId: firebaseUser.uid,
      name: name || `User ${firebaseUser.uid.slice(-6)}`,
      email: `anonymous-${firebaseUser.uid}@local.app`,
      role,
      city,
    };

    try {
      // Save to Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      setUser(userData);
      
      // Also save to localStorage as backup
      localStorage.setItem(`user_${firebaseUser.uid}`, JSON.stringify(userData));
    } catch (error) {
      console.error('Error updating user role:', error);
      // If Firestore fails, at least save to localStorage
      localStorage.setItem(`user_${firebaseUser.uid}`, JSON.stringify(userData));
      setUser(userData);
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
