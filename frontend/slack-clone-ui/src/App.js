import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import MainPage from './components/MainPage';
import { SelectedChannelProvider } from './context/SelectedChannelContext';



const App = () => {
  return (
    <AuthProvider>
      <SelectedChannelProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            } 
          />
          {/* If you have other routes, they go here */}
        </Routes>
      </Router>
      </SelectedChannelProvider>
    </AuthProvider>
  );
};

// Define a ProtectedRoute component for handling private routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log('isAuthenticated', isAuthenticated);
  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default App;
