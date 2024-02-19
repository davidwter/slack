import React, { useEffect,createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('isAuthenticated updated:', isAuthenticated);
    
  }, [isAuthenticated]); // This effect depends on `isAuthenticated`


  const login = (token) => {
    console.log('Logging in with token:', token);
    localStorage.setItem('token', token); // Store the token
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove the token
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
