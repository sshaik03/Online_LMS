import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';

// Create the context
const UserContext = createContext();

// Custom hook for using the context
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user data in localStorage on component mount
    const user = getCurrentUser();
    console.log('Current user data:', user); // Add this to debug
    if (user) {
      setIsLoggedIn(true);
      setUserRole(user.role || '');
      // Try to get the username from the user object, checking all possible properties
      const userDisplayName = user.user?.username || user.username || user.user?.name || user.name || user.user?.email || user.email || 'User';
      setUsername(userDisplayName);
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle login
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUserRole(userData.role || '');
    const userDisplayName = userData.user?.username || userData.username || userData.user?.name || userData.name || userData.user?.email || userData.email || 'User';
    setUsername(userDisplayName);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setUsername('');
  };

  const value = {
    isLoggedIn,
    userRole,
    username,
    isLoading,
    handleLogin,
    handleLogout
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};