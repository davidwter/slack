// src/App.js
import React from 'react';
import Login from './components/Login';
import { CssBaseline, Box, Container } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
// Import other components

const storeToken = (token) => {
  // Store the token in local storage
  localStorage.setItem('token', token);
}


const App = () => {
  const handleLogin = (user) => {
    // Logic after successful login
    // E.g., setting user state, redirecting, etc.
    //console.log(user);
    storeToken(user.token);
  };

  return (
    <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <Header />
    <Sidebar />
    <MainContent />
  </Box>
  );
}

export default App;
