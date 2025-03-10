import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import styled from 'styled-components';

// Pages
import WelcomePage from './pages/WelcomePage';
import PlayerFeedPage from './pages/PlayerFeedPage';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
`;

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <AppContainer>
      <Header />
      <MainContent>
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/feed" replace /> : <WelcomePage />} 
          />
          <Route 
            path="/feed" 
            element={
              <ProtectedRoute>
                <PlayerFeedPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainContent>
      <Footer />
    </AppContainer>
  );
};

export default App;
