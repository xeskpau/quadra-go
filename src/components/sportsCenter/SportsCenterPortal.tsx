import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useSportsCenter } from '../../contexts/SportsCenterContext';
import SportsCenterRegistration from './SportsCenterRegistration';
import CreateSportsCenter from './CreateSportsCenter';
import SportsCenterDashboard from './SportsCenterDashboard';
import FacilityManager from './FacilityManager';
import PromotionManager from './PromotionManager';
import { generateMockSportsCenters, generateMockFacilities, generateMockTimeSlots, generateMockBookings, generateMockPromotions } from '../../utils/mockData';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  color: #2d3748;
  margin: 0;
`;

const Navigation = styled.nav`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const NavItem = styled.button<{ $active: boolean }>`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.$active ? '#0072ff' : 'transparent'};
  color: ${props => props.$active ? '#0072ff' : '#4a5568'};
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #0072ff;
  }
`;

const Button = styled.button`
  background-color: #0072ff;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0058cc;
  }
  
  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0072ff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background-color: #FED7D7;
  color: #822727;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SportsCenterPortal: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    sportsCenterUser, 
    sportsCenters, 
    currentSportsCenter,
    facilities,
    loading, 
    error,
    registerAsSportsCenter,
    createNewSportsCenter,
    selectSportsCenter,
    addFacility,
    addTimeSlot,
    addPromotion
  } = useSportsCenter();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [generatingMockData, setGeneratingMockData] = useState(false);
  
  // If the user is not registered as a sports center user, show the registration form
  if (!sportsCenterUser && !loading) {
    return (
      <Container>
        <Title>Sports Center Portal</Title>
        <p>Register as a sports center to access the portal.</p>
        <SportsCenterRegistration />
      </Container>
    );
  }
  
  // If the user has no sports centers, show the create form
  if (sportsCenters.length === 0 && !loading) {
    return (
      <Container>
        <Title>Sports Center Portal</Title>
        <p>Create your first sports center to get started.</p>
        <CreateSportsCenter />
      </Container>
    );
  }
  
  // Generate mock data for the selected sports center
  const generateMockData = async () => {
    if (!currentSportsCenter || !currentUser) return;
    
    setGeneratingMockData(true);
    
    try {
      // Generate mock facilities
      const mockFacilities = generateMockFacilities(currentSportsCenter);
      
      // Add each facility
      for (const facility of mockFacilities) {
        const { id, ...facilityData } = facility;
        await addFacility(facilityData);
      }
      
      // Generate mock time slots for each facility
      for (const facility of mockFacilities) {
        const mockTimeSlots = generateMockTimeSlots(facility, currentSportsCenter);
        
        // Add each time slot
        for (const timeSlot of mockTimeSlots) {
          const { id, ...timeSlotData } = timeSlot;
          await addTimeSlot(timeSlotData);
        }
      }
      
      // Generate mock promotions
      const mockPromotions = generateMockPromotions(currentSportsCenter.id, currentSportsCenter.sports);
      
      // Add each promotion
      for (const promotion of mockPromotions) {
        const { id, ...promotionData } = promotion;
        await addPromotion(promotionData);
      }
      
      // Refresh the current sports center to load the new data
      await selectSportsCenter(currentSportsCenter.id);
      
      alert('Mock data generated successfully!');
    } catch (err) {
      console.error('Error generating mock data:', err);
      alert('Failed to generate mock data. Please try again.');
    } finally {
      setGeneratingMockData(false);
    }
  };
  
  if (loading || generatingMockData) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <p>{generatingMockData ? 'Generating mock data...' : 'Loading...'}</p>
      </LoadingContainer>
    );
  }
  
  return (
    <Container>
      <Header>
        <Title>Sports Center Portal</Title>
        
        {currentSportsCenter && facilities.length === 0 && (
          <Button 
            onClick={generateMockData}
            disabled={generatingMockData}
            data-testid="generate-mock-data-button"
          >
            Generate Mock Data
          </Button>
        )}
      </Header>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Navigation>
        <NavItem 
          $active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')}
          data-testid="dashboard-tab"
        >
          Dashboard
        </NavItem>
        <NavItem 
          $active={activeTab === 'facilities'} 
          onClick={() => setActiveTab('facilities')}
          data-testid="facilities-tab"
        >
          Facilities
        </NavItem>
        <NavItem 
          $active={activeTab === 'promotions'} 
          onClick={() => setActiveTab('promotions')}
          data-testid="promotions-tab"
        >
          Promotions
        </NavItem>
      </Navigation>
      
      {activeTab === 'dashboard' && <SportsCenterDashboard />}
      {activeTab === 'facilities' && <FacilityManager />}
      {activeTab === 'promotions' && <PromotionManager />}
    </Container>
  );
};

export default SportsCenterPortal; 