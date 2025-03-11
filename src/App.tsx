import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { SportsCenterProvider } from './contexts/SportsCenterContext';
import LoginModal from './components/auth/LoginModal';
import UserProfile from './components/auth/UserProfile';
import SportsCenterPortal from './components/sportsCenter/SportsCenterPortal';
import WelcomePage from './components/WelcomePage';
import SportsCenterDiscovery from './components/discovery/SportsCenterDiscovery';
import StaffManager from './components/sportsCenter/StaffManager';
import { useAuth } from './contexts/AuthContext';

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', 'Helvetica Neue', sans-serif;
  }
  
  body {
    background-color: #f5f7fa;
    color: #333;
  }
`;

// Styled components
const Header = styled.header`
  background: linear-gradient(135deg, #00c6ff, #0072ff);
  color: white;
  padding: 1.5rem 0;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Logo = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
`;

const Tagline = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  margin-top: 0.5rem;
`;

const HeaderCenter = styled.div`
  text-align: center;
  flex-grow: 1;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const LoginButton = styled.button`
  background-color: transparent;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  border: 2px solid white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: white;
    color: #0072ff;
  }
`;

const MainContainer = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 4rem;
`;

const HeroTitle = styled.h2`
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  color: #2d3748;
`;

const HeroDescription = styled.p`
  font-size: 1.2rem;
  max-width: 800px;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 2rem;
`;

const CTAButton = styled.button`
  background-color: #0072ff;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  box-shadow: 0 4px 10px rgba(0, 114, 255, 0.3);
  
  &:hover {
    background-color: #0058cc;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 114, 255, 0.4);
  }
`;

const FeaturesSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  color: #0072ff;
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #2d3748;
`;

const FeatureDescription = styled.p`
  color: #4a5568;
  line-height: 1.5;
`;

const Footer = styled.footer.attrs({
  role: 'contentinfo'
})`
  background-color: #2d3748;
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: 3rem;
`;

const NavMenu = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Main AppContent component that uses the authentication context
const AppContent: React.FC = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { currentUser, userRole } = useAuth();
  
  // Determine navigation links based on user role
  const getNavLinks = () => {
    if (!currentUser) {
      return (
        <>
          <NavLink to="/" data-testid="home-link">Home</NavLink>
          <NavLink to="/discover" data-testid="discover-link">Discover</NavLink>
        </>
      );
    }
    
    if (userRole === 'sports_center_admin' || userRole === 'sports_center_staff') {
      return (
        <>
          <NavLink to="/" data-testid="home-link">Home</NavLink>
          <NavLink to="/sports-center" data-testid="sports-center-link">Dashboard</NavLink>
          {userRole === 'sports_center_admin' && (
            <NavLink to="/sports-center/staff" data-testid="staff-link">Staff</NavLink>
          )}
        </>
      );
    }
    
    // Regular user
    return (
      <>
        <NavLink to="/" data-testid="home-link">Home</NavLink>
        <NavLink to="/discover" data-testid="discover-link">Discover</NavLink>
        <NavLink to="/bookings" data-testid="bookings-link">My Bookings</NavLink>
      </>
    );
  };
  
  return (
    <>
      <GlobalStyle />
      <Header>
        <HeaderContent>
          <NavMenu>
            {getNavLinks()}
          </NavMenu>
          <HeaderCenter>
            <Logo>QuadraGo</Logo>
            <Tagline>Connect with sports centers near you</Tagline>
          </HeaderCenter>
          <HeaderRight>
            {currentUser ? (
              <UserProfile />
            ) : (
              <LoginButton onClick={() => setLoginModalOpen(true)} data-testid="login-button">
                Log In
              </LoginButton>
            )}
          </HeaderRight>
        </HeaderContent>
      </Header>
      
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/discover" element={<SportsCenterDiscovery />} />
        <Route path="/sports-center" element={<SportsCenterPortal />} />
        <Route path="/sports-center/staff" element={<StaffManager />} />
        <Route path="/login" element={<LoginModal isOpen={true} onClose={() => {}} />} />
      </Routes>
      
      <Footer>
        <p>&copy; {new Date().getFullYear()} QuadraGo. All rights reserved.</p>
      </Footer>
      
      {loginModalOpen && (
        <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      )}
    </>
  );
};

// Main App component that provides context providers
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <SportsCenterProvider>
          <AppContent />
        </SportsCenterProvider>
      </AuthProvider>
    </Router>
  );
};

export default App; 