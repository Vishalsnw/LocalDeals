
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { signInAnonymously as firebaseSignInAnonymously, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInAnonymously: () => Promise<void>;
  updateUserRole: (role: 'user' | 'owner', city: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const signInAnonymously = async () => {
    try {
      const result = await firebaseSignInAnonymously(auth);
      console.log('Anonymous sign in successful:', result.user.uid);
    } catch (error) {
      console.error('Error signing in:', error);
      // Create a demo user if Firebase fails
      const demoUser: User = {
        userId: 'demo-' + Date.now(),
        name: 'Demo User',
        email: '',
        role: 'user',
        city: '',
        createdAt: new Date()
      };
      setUser(demoUser);
      localStorage.setItem('demoUser', JSON.stringify(demoUser));
    }
  };

  const updateUserRole = async (role: 'user' | 'owner', city: string, name?: string) => {
    if (!firebaseUser && !user) return;

    const userId = firebaseUser?.uid || user?.userId || 'demo-' + Date.now();
    const userData: User = {
      userId,
      name: name || 'User',
      email: firebaseUser?.email || '',
      role,
      city,
      createdAt: user?.createdAt || new Date()
    };

    try {
      if (firebaseUser) {
        await setDoc(doc(db, 'users', userId), userData);
      }
      setUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
      console.log('User profile saved successfully:', userData);
    } catch (error) {
      console.error('Error updating user profile:', error);
      // Still set local user even if Firestore fails
      setUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  };

  useEffect(() => {
    // Check for existing user data in localStorage
    const storedUserData = localStorage.getItem('userData');
    const storedDemoUser = localStorage.getItem('demoUser');
    
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setUser(userData);
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }

    if (storedDemoUser) {
      try {
        const demoUserData = JSON.parse(storedDemoUser);
        setUser(demoUserData);
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing demo user data:', error);
      }
    }

    // Try Firebase auth
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
            localStorage.setItem('userData', JSON.stringify(userData));
          } else {
            // New Firebase user, but no profile yet
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      loading,
      signInAnonymously,
      updateUserRole
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
