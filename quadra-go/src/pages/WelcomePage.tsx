import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 60px;
  max-width: 800px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--dark-gray);
  margin-bottom: 30px;
`;

const CTAButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #3d8b40;
  }
`;

const AuthSection = styled.section`
  display: flex;
  justify-content: center;
  gap: 40px;
  width: 100%;
  max-width: 900px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const AuthContainer = styled.div`
  flex: 1;
  max-width: 400px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const WelcomePage: React.FC = () => {
  const [activeForm, setActiveForm] = useState<'login' | 'signup'>('login');
  
  // Check for hash in URL to determine which form to show
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#signup') {
      setActiveForm('signup');
    } else if (hash === '#login') {
      setActiveForm('login');
    }
  }, []);
  
  return (
    <PageContainer>
      <HeroSection>
        <Title>Welcome to QuadraGo</Title>
        <Subtitle>
          Find and book sports facilities near you. Connect with sports centers
          and enjoy your favorite activities hassle-free.
        </Subtitle>
        <CTAButton onClick={() => setActiveForm('signup')}>Get Started</CTAButton>
      </HeroSection>
      
      <AuthSection id="auth-section">
        <AuthContainer id="login">
          <LoginForm />
        </AuthContainer>
        
        <AuthContainer id="signup">
          <SignupForm />
        </AuthContainer>
      </AuthSection>
    </PageContainer>
  );
};

export default WelcomePage; 