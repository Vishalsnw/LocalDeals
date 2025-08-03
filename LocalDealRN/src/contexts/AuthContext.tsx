
import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  userId: string;
  name: string;
  email: string;
  role: 'user' | 'owner';
  city: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseAuthTypes.User | null;
  loading: boolean;
  signInAnonymously: () => Promise<void>;
  updateUserRole: (role: 'user' | 'owner', city: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  const signInAnonymously = async () => {
    try {
      const result = await auth().signInAnonymously();
      console.log('Anonymous sign in successful:', result.user.uid);
    } catch (error) {
      console.error('Error signing in:', error);
      // Create demo user as fallback
      const demoUser: User = {
        userId: 'demo-' + Date.now(),
        name: 'Demo User',
        email: '',
        role: 'user',
        city: '',
        createdAt: new Date()
      };
      setUser(demoUser);
      await AsyncStorage.setItem('demoUser', JSON.stringify(demoUser));
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
        await firestore().collection('users').doc(userId).set(userData);
      }
      setUser(userData);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('User profile saved successfully:', userData);
    } catch (error) {
      console.error('Error updating user profile:', error);
      setUser(userData);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
      setUser(null);
      setFirebaseUser(null);
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('demoUser');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        const storedDemoUser = await AsyncStorage.getItem('demoUser');
        
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUser(userData);
          setLoading(false);
          return;
        }

        if (storedDemoUser) {
          const demoUserData = JSON.parse(storedDemoUser);
          setUser(demoUserData);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
      }

      // Firebase auth state listener
      const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
        setFirebaseUser(firebaseUser);
        
        if (firebaseUser) {
          try {
            const userDoc = await firestore().collection('users').doc(firebaseUser.uid).get();
            if (userDoc.exists) {
              const userData = userDoc.data() as User;
              setUser(userData);
              await AsyncStorage.setItem('userData', JSON.stringify(userData));
            } else {
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
      });

      return () => unsubscribe();
    };

    loadStoredUser();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      loading,
      signInAnonymously,
      updateUserRole,
      signOut
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
