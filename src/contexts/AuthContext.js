import React, { createContext, useState, useContext, useEffect } from 'react';
import { CommonActions } from '@react-navigation/native';
import { getCurrentUser } from '../api/authApi';
import { navigationRef } from '../../App'; // Import from App.js

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      console.log('Current user from storage:', currentUser);
      setUser(currentUser);
    } catch (error) {
      console.error('Check user error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function - updates user state
  const login = (userData) => {
    console.log('Setting user in context:', userData);
    setUser(userData);
  };

  // Register function - updates user state
  const register = (userData) => {
    console.log('Setting user in context after registration:', userData);
    setUser(userData);
  };

  // Logout function - clears user state and resets navigation
  const logout = async () => {
    try {
      // Clear user data
      setUser(null);
      
      // Reset navigation safely
      if (navigationRef.current) {
        navigationRef.current.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          })
        );
      }
    } catch (error) {
      console.error('Logout navigation error:', error);
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    checkUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};