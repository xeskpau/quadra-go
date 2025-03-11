import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 4rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: #2d3748;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #4a5568;
  font-weight: 400;
  max-width: 800px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const Button = styled.button`
  background-color: #0072ff;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem 2.5rem;
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
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const OutlineButton = styled(Button)`
  background-color: transparent;
  color: #0072ff;
  border: 2px solid #0072ff;
  box-shadow: none;
  
  &:hover {
    background-color: rgba(0, 114, 255, 0.1);
    color: #0058cc;
    border-color: #0058cc;
  }
`;

const FeaturesSection = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #2d3748;
  text-align: center;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
  font-size: 2.5rem;
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

const HowItWorksSection = styled.section`
  margin-bottom: 4rem;
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Step = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StepNumber = styled.div`
  background-color: #0072ff;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex-grow: 1;
`;

const StepTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #2d3748;
`;

const StepDescription = styled.p`
  color: #4a5568;
  line-height: 1.5;
`;

const CTASection = styled.section`
  background-color: #0072ff;
  color: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 4rem;
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.9;
`;

const CTAButton = styled(Button)`
  background-color: white;
  color: #0072ff;
  
  &:hover {
    background-color: #f8fafc;
    color: #0058cc;
  }
`;

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const handleUserLogin = () => {
    navigate('/login', { state: { role: 'user' } });
  };
  
  const handleSportsCenterLogin = () => {
    navigate('/login', { state: { role: 'sports_center_admin' } });
  };
  
  const handleExplore = () => {
    navigate('/discover');
  };
  
  return (
    <Container>
      <HeroSection>
        <HeroTitle>Welcome to QuadraGo</HeroTitle>
        <HeroSubtitle>
          Connect with sports centers near you. Find and book sports facilities for various activities like beach volleyball, tennis, soccer, and more.
        </HeroSubtitle>
        
        <ButtonGroup>
          {currentUser ? (
            <Button onClick={handleExplore} data-testid="explore-button">
              Explore Sports Centers
            </Button>
          ) : (
            <>
              <Button onClick={handleUserLogin} data-testid="user-login-button">
                Sign In as User
              </Button>
              <OutlineButton onClick={handleSportsCenterLogin} data-testid="sports-center-login-button">
                Sports Center Portal
              </OutlineButton>
            </>
          )}
        </ButtonGroup>
      </HeroSection>
      
      <FeaturesSection>
        <SectionTitle>Features</SectionTitle>
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>🔍</FeatureIcon>
            <FeatureTitle>Find Nearby Facilities</FeatureTitle>
            <FeatureDescription>
              Discover sports centers and facilities near your location with our intuitive map interface.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📅</FeatureIcon>
            <FeatureTitle>Easy Booking</FeatureTitle>
            <FeatureDescription>
              Book sports facilities with just a few clicks. View available time slots and confirm your reservation instantly.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🏆</FeatureIcon>
            <FeatureTitle>Various Sports</FeatureTitle>
            <FeatureDescription>
              Find facilities for a wide range of sports including tennis, soccer, basketball, volleyball, and more.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </FeaturesSection>
      
      <HowItWorksSection>
        <SectionTitle>How It Works</SectionTitle>
        <StepsContainer>
          <Step>
            <StepNumber>1</StepNumber>
            <StepContent>
              <StepTitle>Create an Account</StepTitle>
              <StepDescription>
                Sign up as a user to book sports facilities or as a sports center to manage your facilities.
              </StepDescription>
            </StepContent>
          </Step>
          
          <Step>
            <StepNumber>2</StepNumber>
            <StepContent>
              <StepTitle>Find Sports Centers</StepTitle>
              <StepDescription>
                Search for sports centers near you, filter by sport, date, and time to find the perfect match.
              </StepDescription>
            </StepContent>
          </Step>
          
          <Step>
            <StepNumber>3</StepNumber>
            <StepContent>
              <StepTitle>Book a Slot</StepTitle>
              <StepDescription>
                Select an available time slot, confirm your booking, and get ready to play!
              </StepDescription>
            </StepContent>
          </Step>
        </StepsContainer>
      </HowItWorksSection>
      
      <CTASection>
        <CTATitle>Ready to Get Started?</CTATitle>
        <CTADescription>
          Join QuadraGo today and discover the best sports facilities in your area. Whether you're looking to play or manage a sports center, we've got you covered.
        </CTADescription>
        
        {currentUser ? (
          <CTAButton onClick={handleExplore}>
            Explore Now
          </CTAButton>
        ) : (
          <CTAButton onClick={handleUserLogin}>
            Sign Up Now
          </CTAButton>
        )}
      </CTASection>
    </Container>
  );
};

export default WelcomePage; 