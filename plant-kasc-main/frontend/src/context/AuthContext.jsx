import { createContext, useState, useEffect } from 'react';
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  resetPassword,
  getUserData,
  onAuthChange
} from '../firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase auth state listener - automatically detects login/logout
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in - get additional data from Firestore
        const result = await getUserData(firebaseUser.uid);
        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || result.data?.name || 'User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || result.data?.photoURL,
          role: result.data?.role || 'user',
          emailVerified: firebaseUser.emailVerified
        };
        setUser(userData);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const result = await loginWithEmail(email, password);
    return result;
  };

  const loginGoogle = async () => {
    const result = await loginWithGoogle();
    return result;
  };

  const register = async (name, email, password) => {
    const result = await registerWithEmail(name, email, password);
    return result;
  };

  const logout = async () => {
    const result = await logoutUser();
    if (result.success) {
      setUser(null);
    }
    return result;
  };

  const forgotPassword = async (email) => {
    const result = await resetPassword(email);
    return result;
  };

  const value = {
    user,
    loading,
    login,
    loginGoogle,
    register,
    logout,
    forgotPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
