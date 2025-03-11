import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SportsCenter, Sport, SportsCenterFilter } from '../../types/index';
import { getSportsCenters, getSports } from '../../firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import MapView from './MapView';

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

const ViewToggleContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
`;

const ViewToggleButton = styled.button<{ $active: boolean }>`
  background-color: ${props => props.$active ? '#0072ff' : 'white'};
  color: ${props => props.$active ? 'white' : '#4a5568'};
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
  
  &:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  
  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  
  &:hover {
    background-color: ${props => props.$active ? '#0058cc' : '#f7fafc'};
  }
`;

const SportsCenterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SportsCenterCard = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
`;

const SportsCenterImage = styled.div<{ $imageUrl?: string }>`
  height: 200px;
  background-image: url(${props => props.$imageUrl || 'https://via.placeholder.com/300x180?text=Sports+Center'});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
  }
`;

const SportsCenterContent = styled.div`
  padding: 1.5rem;
`;

const SportsCenterName = styled.h3`
  color: #1a202c;
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
  font-weight: 600;
`;

const SportsCenterAddress = styled.p`
  color: #718096;
  margin-bottom: 1.2rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  
  &::before {
    content: '📍';
    margin-right: 0.5rem;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  color: #4a5568;
  font-size: 0.9rem;
  
  &::before {
    margin-right: 0.5rem;
  }
`;

const OpeningHoursInfo = styled(InfoRow)`
  &::before {
    content: '🕒';
  }
`;

const AmenitiesInfo = styled(InfoRow)`
  &::before {
    content: '✨';
  }
`;

const PriceInfo = styled(InfoRow)`
  &::before {
    content: '💰';
  }
  font-weight: 600;
  color: #3182ce;
`;

const DistanceInfo = styled(InfoRow)`
  &::before {
    content: '📏';
  }
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: #e2e8f0;
  margin: 1rem 0;
`;

const SportsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
`;

const SportTag = styled.span`
  background-color: #ebf8ff;
  color: #3182ce;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 114, 255, 0.1);
  
  &::before {
    content: attr(data-icon);
    margin-right: 0.3rem;
  }
`;

const ViewButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
  padding: 0.8rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 114, 255, 0.2);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-top-color: #0072ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #fff5f5;
  color: #e53e3e;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 500;
`;

const EmptyState = styled.div`
  background-color: #f7fafc;
  padding: 3rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 2rem;
  
  h3 {
    color: #4a5568;
    margin-bottom: 1rem;
  }
  
  p {
    color: #718096;
    margin-bottom: 1.5rem;
  }
`;

const SportsCenterDiscovery: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sportsCenters, setSportsCenters] = useState<SportsCenter[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Parse URL search params for filters
  const searchParams = new URLSearchParams(location.search);
  
  // Initialize filters from URL params
  const initialFilters: SportsCenterFilter = {
    sport: searchParams.get('sport') || undefined,
    priceRange: {
      min: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0,
      max: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 1000
    },
    location: searchParams.get('lat') && searchParams.get('lng') && searchParams.get('radius') ? {
      latitude: Number(searchParams.get('lat')),
      longitude: Number(searchParams.get('lng')),
      radius: Number(searchParams.get('radius'))
    } : undefined,
    view: (searchParams.get('view') as 'map' | 'list' | undefined) || 'list'
  };
  
  const [filters, setFilters] = useState<SportsCenterFilter>(initialFilters);
  const [filteredCenters, setFilteredCenters] = useState<SportsCenter[]>([]);
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [centersData, sportsData] = await Promise.all([
          getSportsCenters(),
          getSports()
        ]);
        
        setSportsCenters(centersData);
        setSports(sportsData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load sports centers. Please try again later.');
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Apply filters and update URL
  useEffect(() => {
    if (loading) return;
    
    // Filter sports centers
    let filtered = [...sportsCenters];
    
    // Filter by sport
    if (filters.sport) {
      filtered = filtered.filter(center => 
        center.sports.some(sport => sport.id === filters.sport)
      );
    }
    
    // Filter by price range
    if (filters.priceRange) {
      // For now, we'll use a placeholder price of 20 for all centers
      // In a real app, this would filter based on actual prices
      const minPrice = 20;
      if (minPrice < filters.priceRange.min) {
        filtered = filtered.filter(() => false);
      }
    }
    
    // Filter by location/distance
    if (filters.location) {
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
    
    setFilteredCenters(filtered);
    
    // Update URL with filters
    const params = new URLSearchParams();
    
    if (filters.sport) params.set('sport', filters.sport);
    if (filters.priceRange) {
      params.set('minPrice', filters.priceRange.min.toString());
      params.set('maxPrice', filters.priceRange.max.toString());
    }
    if (filters.location) {
      params.set('lat', filters.location.latitude.toString());
      params.set('lng', filters.location.longitude.toString());
      params.set('radius', filters.location.radius.toString());
    }
    if (filters.view) params.set('view', filters.view);
    
    // Update URL without reloading the page
    navigate(`?${params.toString()}`, { replace: true });
    
  }, [filters, sportsCenters, loading, navigate]);
  
  // Calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
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
    setFilters({
      view: filters.view // Preserve the current view
    });
  };
  
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFilters(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              radius: prev.location?.radius || 10 // Default 10km radius
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check your browser settings.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };
  
  const toggleView = (view: 'map' | 'list') => {
    setFilters(prev => ({
      ...prev,
      view
    }));
  };
  
  const renderSportsTags = (center: SportsCenter) => {
    return center.sports.slice(0, 3).map((sport, index) => {
      const sportIcon = sports.find(s => s.id === sport.id)?.icon || '';
      return (
        <SportTag key={index} data-icon={sportIcon}>
          {sport.name}
        </SportTag>
      );
    });
  };
  
  if (loading) {
    return (
      <Container>
        <Title>Discover Sports Centers</Title>
        <LoadingSpinner data-testid="loading-spinner" />
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <Title>Discover Sports Centers</Title>
        <ErrorMessage data-testid="error-message">
          {error}
        </ErrorMessage>
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
            <FilterLabel htmlFor="price-min-filter">Min Price</FilterLabel>
            <Input 
              id="price-min-filter"
              data-testid="price-min-filter"
              type="number"
              min="0"
              value={filters.priceRange?.min || ''}
              onChange={(e) => handleFilterChange('priceRange', {
                ...filters.priceRange,
                min: Number(e.target.value)
              })}
            />
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel htmlFor="price-max-filter">Max Price</FilterLabel>
            <Input 
              id="price-max-filter"
              data-testid="price-max-filter"
              type="number"
              min="0"
              value={filters.priceRange?.max || ''}
              onChange={(e) => handleFilterChange('priceRange', {
                ...filters.priceRange,
                max: Number(e.target.value)
              })}
            />
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel htmlFor="distance-filter">Distance (km)</FilterLabel>
            <Input 
              id="distance-filter"
              data-testid="distance-filter"
              type="number"
              min="1"
              max="100"
              value={filters.location?.radius || ''}
              onChange={(e) => {
                if (filters.location) {
                  handleFilterChange('location', {
                    ...filters.location,
                    radius: Number(e.target.value)
                  });
                }
              }}
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
      
      <ViewToggleContainer>
        <ViewToggleButton 
          $active={filters.view === 'list'} 
          onClick={() => toggleView('list')}
          data-testid="list-view-button"
        >
          List View
        </ViewToggleButton>
        <ViewToggleButton 
          $active={filters.view === 'map'} 
          onClick={() => toggleView('map')}
          data-testid="map-view-button"
        >
          Map View
        </ViewToggleButton>
      </ViewToggleContainer>
      
      {filteredCenters.length === 0 ? (
        <EmptyState data-testid="empty-state">
          <h3>No Sports Centers Found</h3>
          <p>Try adjusting your filters or clearing them to see more results.</p>
          <Button onClick={handleClearFilters}>Clear All Filters</Button>
        </EmptyState>
      ) : (
        <>
          {filters.view === 'map' ? (
            <MapView 
              sportsCenters={filteredCenters} 
              userLocation={filters.location}
              calculateDistance={calculateDistance}
            />
          ) : (
            <SportsCenterGrid>
              {filteredCenters.map((center) => {
                // Calculate distance if user location is available
                let distance = null;
                if (filters.location) {
                  distance = calculateDistance(
                    filters.location.latitude,
                    filters.location.longitude,
                    center.location.latitude,
                    center.location.longitude
                  );
                }
                
                return (
                  <SportsCenterCard key={center.id}>
                    <SportsCenterImage $imageUrl={center.photoURL} />
                    <SportsCenterContent>
                      <SportsCenterName>{center.name}</SportsCenterName>
                      <SportsCenterAddress>{center.address}, {center.city}</SportsCenterAddress>
                      
                      <SportsList>
                        {renderSportsTags(center)}
                      </SportsList>
                      
                      <OpeningHoursInfo>
                        Open today: 05:00 - 23:00
                      </OpeningHoursInfo>
                      
                      <AmenitiesInfo>
                        parking, showers, lockers +2 more
                      </AmenitiesInfo>
                      
                      <PriceInfo>
                        From $20/hr
                      </PriceInfo>
                      
                      {distance !== null && (
                        <DistanceInfo>
                          {distance.toFixed(1)} km away
                        </DistanceInfo>
                      )}
                      
                      <Divider />
                      
                      <ViewButton onClick={() => navigate(`/sports-center/${center.id}`)}>
                        View Details
                      </ViewButton>
                    </SportsCenterContent>
                  </SportsCenterCard>
                );
              })}
            </SportsCenterGrid>
          )}
        </>
      )}
    </Container>
  );
};

export default SportsCenterDiscovery; 