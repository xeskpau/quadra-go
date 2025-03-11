import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SportsCenter, Sport, SportsCenterFilter } from '../../types';
import { getSportsCenters, getSports } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #2d3748;
  margin-bottom: 2rem;
`;

const FiltersContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const FilterTitle = styled.h3`
  color: #4a5568;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 1rem;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #0072ff;
    box-shadow: 0 0 0 2px rgba(0, 114, 255, 0.2);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #0072ff;
    box-shadow: 0 0 0 2px rgba(0, 114, 255, 0.2);
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

const ClearButton = styled(Button)`
  background-color: transparent;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  
  &:hover {
    background-color: #f7fafc;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
`;

const SportsCenterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SportsCenterCard = styled.div`
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const SportsCenterImage = styled.div<{ $imageUrl?: string }>`
  height: 180px;
  background-image: url(${props => props.$imageUrl || 'https://via.placeholder.com/300x180?text=Sports+Center'});
  background-size: cover;
  background-position: center;
`;

const SportsCenterContent = styled.div`
  padding: 1.5rem;
`;

const SportsCenterName = styled.h3`
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
`;

const SportsCenterAddress = styled.p`
  color: #718096;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const SportsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SportTag = styled.span`
  background-color: #ebf4ff;
  color: #3182ce;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ViewButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const EmptyStateTitle = styled.h3`
  color: #4a5568;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: #718096;
  margin-bottom: 1.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0072ff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  margin: 1rem 0;
  background-color: #fff3f3;
  border-radius: 8px;
  border: 1px solid #ffcaca;
`;

const ErrorIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ErrorText = styled.p`
  font-size: 1rem;
  color: #e53935;
  text-align: center;
`;

const SportsCenterDiscovery: React.FC = () => {
  const [sportsCenters, setSportsCenters] = useState<SportsCenter[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<SportsCenter[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [filters, setFilters] = useState<SportsCenterFilter>({});
  
  const navigate = useNavigate();
  
  // Load sports centers and sports
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load sports centers
        const centers = await getSportsCenters();
        setSportsCenters(centers);
        setFilteredCenters(centers);
        
        // Load sports
        const sportsData = await getSports();
        setSports(sportsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load sports centers');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Apply filters when they change
  useEffect(() => {
    if (sportsCenters.length === 0) return;
    
    let filtered = [...sportsCenters];
    
    // Filter by sport
    if (filters.sport) {
      filtered = filtered.filter(center => 
        center.sports.some(sport => sport.id === filters.sport)
      );
    }
    
    // Filter by location (if implemented)
    if (filters.location) {
      // This would require a more complex implementation with geolocation
      // For now, we'll just simulate it
      filtered = filtered.filter(center => {
        const distance = calculateDistance(
          filters.location!.latitude,
          filters.location!.longitude,
          center.location.latitude,
          center.location.longitude
        );
        return distance <= filters.location!.radius;
      });
    }
    
    // Filter by price range
    if (filters.priceRange) {
      // This would require checking facility prices
      // For now, we'll just simulate it with a random price
      filtered = filtered.filter(center => {
        const averagePrice = Math.floor(Math.random() * 100) + 20; // Random price between 20 and 120
        return averagePrice >= filters.priceRange!.min && averagePrice <= filters.priceRange!.max;
      });
    }
    
    setFilteredCenters(filtered);
  }, [filters, sportsCenters]);
  
  // Helper function to calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };
  
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };
  
  const handleFilterChange = (key: keyof SportsCenterFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleClearFilters = () => {
    setFilters({});
    setFilteredCenters(sportsCenters);
  };
  
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFilters(prev => ({
            ...prev,
            location: {
              latitude,
              longitude,
              radius: 10 // Default radius of 10km
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Failed to get your location');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };
  
  if (loading) {
    return (
      <Container>
        <Title>Discover Sports Centers</Title>
        <LoadingContainer data-testid="loading-spinner">
          <LoadingSpinner />
          <LoadingText>Loading sports centers...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }
  
  return (
    <Container>
      <Title>Discover Sports Centers</Title>
      
      <FiltersContainer>
        <FilterTitle>Filters</FilterTitle>
        <FilterGrid>
          <FilterGroup>
            <FilterLabel htmlFor="sport-filter">Sport</FilterLabel>
            <Select 
              id="sport-filter"
              data-testid="sport-filter"
              value={filters.sport || ''}
              onChange={(e) => handleFilterChange('sport', e.target.value || undefined)}
            >
              <option value="">All Sports</option>
              {sports.map(sport => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </Select>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel htmlFor="price-min">Min Price</FilterLabel>
            <Input 
              id="price-min"
              data-testid="price-min-filter"
              type="number"
              min="0"
              value={filters.priceRange?.min || ''}
              onChange={(e) => handleFilterChange('priceRange', {
                ...filters.priceRange,
                min: parseInt(e.target.value) || 0
              })}
            />
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel htmlFor="price-max">Max Price</FilterLabel>
            <Input 
              id="price-max"
              data-testid="price-max-filter"
              type="number"
              min="0"
              value={filters.priceRange?.max || ''}
              onChange={(e) => handleFilterChange('priceRange', {
                ...filters.priceRange,
                max: parseInt(e.target.value) || 1000
              })}
            />
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel htmlFor="location-radius">Distance (km)</FilterLabel>
            <Input 
              id="location-radius"
              data-testid="distance-filter"
              type="number"
              min="1"
              max="100"
              value={filters.location?.radius || ''}
              onChange={(e) => handleFilterChange('location', {
                ...filters.location,
                radius: parseInt(e.target.value) || 10
              })}
              disabled={!filters.location}
            />
          </FilterGroup>
        </FilterGrid>
        
        <ButtonGroup>
          <ClearButton 
            data-testid="clear-filters-button"
            onClick={handleClearFilters}
          >
            Clear Filters
          </ClearButton>
          <Button 
            data-testid="use-location-button"
            onClick={handleUseCurrentLocation}
          >
            Use My Location
          </Button>
        </ButtonGroup>
      </FiltersContainer>
      
      {error && (
        <ErrorContainer data-testid="error-message">
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
      )}
      
      {filteredCenters.length > 0 ? (
        <SportsCenterGrid>
          {filteredCenters.map((center) => (
            <SportsCenterCard 
              key={center.id} 
              data-testid={`sports-center-${center.id}`}
            >
              <SportsCenterImage $imageUrl={center.photoURL} />
              <SportsCenterContent>
                <SportsCenterName>{center.name}</SportsCenterName>
                <SportsCenterAddress>
                  {center.address}, {center.city}, {center.state} {center.zipCode}
                </SportsCenterAddress>
                <SportsList key={`sports-list-${center.id}`}>
                  {center.sports.slice(0, 3).map(sport => (
                    <SportTag key={sport.id}>{sport.name}</SportTag>
                  ))}
                  {center.sports.length > 3 && (
                    <SportTag key="more-sports">+{center.sports.length - 3} more</SportTag>
                  )}
                </SportsList>
                <ViewButton 
                  data-testid={`view-center-${center.id}`}
                  onClick={() => navigate(`/sports-center/${center.id}`)}
                >
                  View Details
                </ViewButton>
              </SportsCenterContent>
            </SportsCenterCard>
          ))}
        </SportsCenterGrid>
      ) : (
        <EmptyState data-testid="empty-state">
          <EmptyStateTitle>No Sports Centers Found</EmptyStateTitle>
          <EmptyStateText>
            Try adjusting your filters or search for a different location.
          </EmptyStateText>
          <Button onClick={handleClearFilters}>
            Clear All Filters
          </Button>
        </EmptyState>
      )}
    </Container>
  );
};

export default SportsCenterDiscovery; 