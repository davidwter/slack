import React from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Header from './Header'; // Assume Header is defined as shown previously
import Sidebar from './Sidebar'; // Sidebar component to be defined
import MainContent from './MainContent'; // MainContent component to be defined

const MainPage = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header />
      <Sidebar />
      <MainContent />
    </Box>
  );
};

export default MainPage;
