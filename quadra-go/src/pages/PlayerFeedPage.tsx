import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { mockSportsCenters, SportsCenter } from '../utils/mockData';
import SportsCenterFilter from '../components/sportsCenters/SportsCenterFilter';
import SportsCenterCard from '../components/sportsCenters/SportsCenterCard';
import SportsCenterMap from '../components/sportsCenters/SportsCenterMap';

const PageContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  color: var(--primary-color);
  margin-bottom: 20px;
`;

const ViewToggle = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: 1px solid var(--primary-color);
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 500;
  
  &:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  
  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

const SportsCenterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NoResultsText = styled.p`
  font-size: 18px;
  color: var(--dark-gray);
`;

interface FilterValues {
  sport: string;
  date: string;
  time: string;
}

const PlayerFeedPage: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'map'>('list');
  const [sportsCenters, setSportsCenters] = useState<SportsCenter[]>(mockSportsCenters);
  const [filteredCenters, setFilteredCenters] = useState<SportsCenter[]>(mockSportsCenters);
  const [filters, setFilters] = useState<FilterValues>({
    sport: '',
    date: '',
    time: ''
  });
  
  // Apply filters when they change
  useEffect(() => {
    let filtered = [...sportsCenters];
    
    if (filters.sport) {
      filtered = filtered.filter(center => center.sports.includes(filters.sport));
    }
    
    if (filters.date && filters.time) {
      filtered = filtered.filter(center => {
        const availableDay = center.availableTimes.find(day => day.date === filters.date);
        if (!availableDay) return false;
        
        const availableSlot = availableDay.slots.find(slot => 
          slot.time === filters.time && slot.available
        );
        
        return !!availableSlot;
      });
    } else if (filters.date) {
      filtered = filtered.filter(center => {
        const availableDay = center.availableTimes.find(day => day.date === filters.date);
        return !!availableDay;
      });
    } else if (filters.time) {
      filtered = filtered.filter(center => {
        return center.availableTimes.some(day => 
          day.slots.some(slot => slot.time === filters.time && slot.available)
        );
      });
    }
    
    setFilteredCenters(filtered);
  }, [filters, sportsCenters]);
  
  const handleFilter = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };
  
  const handleBookClick = (id: string) => {
    // In a real app, this would navigate to a booking page
    console.log(`Booking sports center with ID: ${id}`);
  };
  
  return (
    <PageContainer>
      <PageTitle>Welcome, {user?.name}</PageTitle>
      
      <SportsCenterFilter onFilter={handleFilter} />
      
      <ViewToggle>
        <ToggleButton 
          active={view === 'list'} 
          onClick={() => setView('list')}
        >
          List View
        </ToggleButton>
        <ToggleButton 
          active={view === 'map'} 
          onClick={() => setView('map')}
        >
          Map View
        </ToggleButton>
      </ViewToggle>
      
      {filteredCenters.length === 0 ? (
        <NoResults>
          <NoResultsText>No sports centers match your filters. Try adjusting your search criteria.</NoResultsText>
        </NoResults>
      ) : view === 'list' ? (
        <SportsCenterGrid>
          {filteredCenters.map(center => (
            <SportsCenterCard 
              key={center.id} 
              sportsCenter={center} 
              onBookClick={handleBookClick} 
            />
          ))}
        </SportsCenterGrid>
      ) : (
        <SportsCenterMap 
          sportsCenters={filteredCenters} 
          onSelectSportsCenter={handleBookClick} 
        />
      )}
    </PageContainer>
  );
};

export default PlayerFeedPage; 