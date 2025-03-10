import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSportsCenter } from '../../contexts/SportsCenterContext';
import { SportsCenter, Facility, Booking, Promotion, AnalyticsData } from '../../types';

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

const SelectWrapper = styled.div`
  min-width: 250px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #0072ff;
    box-shadow: 0 0 0 2px rgba(0, 114, 255, 0.2);
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const CardTitle = styled.h3`
  color: #4a5568;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #0072ff;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #718096;
  font-size: 0.9rem;
`;

const TabsContainer = styled.div`
  margin-bottom: 2rem;
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
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

const TabPanel = styled.div<{ $active: boolean }>`
  display: ${props => props.$active ? 'block' : 'none'};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background-color: #f7fafc;
  color: #4a5568;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
`;

const Button = styled.button`
  background-color: #0072ff;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
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

const Badge = styled.span<{ $type: 'success' | 'warning' | 'danger' | 'info' }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  background-color: ${props => {
    switch (props.$type) {
      case 'success': return '#C6F6D5';
      case 'warning': return '#FEEBC8';
      case 'danger': return '#FED7D7';
      case 'info': return '#BEE3F8';
    }
  }};
  
  color: ${props => {
    switch (props.$type) {
      case 'success': return '#22543D';
      case 'warning': return '#744210';
      case 'danger': return '#822727';
      case 'info': return '#2A4365';
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #718096;
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-top: 1rem;
`;

// Mock chart component (in a real app, you'd use a library like recharts)
const Chart = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f7fafc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
`;

const SportsCenterDashboard: React.FC = () => {
  const { 
    sportsCenters, 
    currentSportsCenter, 
    selectSportsCenter, 
    facilities, 
    bookings, 
    promotions,
    analyticsData,
    generateAnalytics,
    refreshBookings
  } = useSportsCenter();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  // Load analytics data when the component mounts or when the selected sports center changes
  useEffect(() => {
    if (currentSportsCenter) {
      loadAnalytics();
      refreshBookings();
    }
  }, [currentSportsCenter]);
  
  const loadAnalytics = async () => {
    setLoading(true);
    await generateAnalytics();
    setLoading(false);
  };
  
  const handleSportsCenterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    selectSportsCenter(selectedId);
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };
  
  // Format time
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(date));
  };
  
  // Get status badge type
  const getStatusBadgeType = (status: string): 'success' | 'warning' | 'danger' | 'info' => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'completed': return 'info';
      default: return 'info';
    }
  };
  
  // Get facility name by ID
  const getFacilityName = (facilityId: string) => {
    const facility = facilities.find(f => f.id === facilityId);
    return facility ? facility.name : 'Unknown Facility';
  };
  
  // Calculate total revenue
  const getTotalRevenue = () => {
    if (!bookings.length) return 0;
    
    return bookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
  };
  
  // Calculate upcoming bookings
  const getUpcomingBookings = () => {
    if (!bookings.length) return 0;
    
    const now = new Date();
    return bookings.filter(b => 
      (b.status === 'confirmed') && 
      new Date(b.startTime) > now
    ).length;
  };
  
  // Calculate active promotions
  const getActivePromotions = () => {
    if (!promotions.length) return 0;
    
    const now = new Date();
    return promotions.filter(p => 
      new Date(p.startDate) <= now && 
      new Date(p.endDate) >= now
    ).length;
  };
  
  return (
    <Container>
      <Header>
        <Title>Sports Center Dashboard</Title>
        
        {sportsCenters.length > 0 && (
          <SelectWrapper>
            <Select 
              value={currentSportsCenter?.id || ''} 
              onChange={handleSportsCenterChange}
              data-testid="sports-center-select"
            >
              {sportsCenters.map(center => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </Select>
          </SelectWrapper>
        )}
      </Header>
      
      {currentSportsCenter ? (
        <>
          <DashboardGrid>
            <Card>
              <CardTitle>Total Revenue</CardTitle>
              <Stat>
                <StatValue>{formatCurrency(getTotalRevenue())}</StatValue>
                <StatLabel>From all bookings</StatLabel>
              </Stat>
            </Card>
            
            <Card>
              <CardTitle>Total Facilities</CardTitle>
              <Stat>
                <StatValue>{facilities.length}</StatValue>
                <StatLabel>Across {currentSportsCenter.sports.length} sports</StatLabel>
              </Stat>
            </Card>
            
            <Card>
              <CardTitle>Upcoming Bookings</CardTitle>
              <Stat>
                <StatValue>{getUpcomingBookings()}</StatValue>
                <StatLabel>Confirmed reservations</StatLabel>
              </Stat>
            </Card>
            
            <Card>
              <CardTitle>Active Promotions</CardTitle>
              <Stat>
                <StatValue>{getActivePromotions()}</StatValue>
                <StatLabel>Current special offers</StatLabel>
              </Stat>
            </Card>
          </DashboardGrid>
          
          <TabsContainer>
            <TabList>
              <Tab 
                $active={activeTab === 'overview'} 
                onClick={() => setActiveTab('overview')}
                data-testid="tab-overview"
              >
                Overview
              </Tab>
              <Tab 
                $active={activeTab === 'bookings'} 
                onClick={() => setActiveTab('bookings')}
                data-testid="tab-bookings"
              >
                Bookings
              </Tab>
              <Tab 
                $active={activeTab === 'facilities'} 
                onClick={() => setActiveTab('facilities')}
                data-testid="tab-facilities"
              >
                Facilities
              </Tab>
              <Tab 
                $active={activeTab === 'promotions'} 
                onClick={() => setActiveTab('promotions')}
                data-testid="tab-promotions"
              >
                Promotions
              </Tab>
              <Tab 
                $active={activeTab === 'analytics'} 
                onClick={() => setActiveTab('analytics')}
                data-testid="tab-analytics"
              >
                Analytics
              </Tab>
            </TabList>
            
            <TabPanel $active={activeTab === 'overview'}>
              <Card>
                <CardTitle>Sports Center Information</CardTitle>
                <p><strong>Name:</strong> {currentSportsCenter.name}</p>
                <p><strong>Address:</strong> {currentSportsCenter.address}, {currentSportsCenter.city}, {currentSportsCenter.state} {currentSportsCenter.zipCode}</p>
                <p><strong>Contact:</strong> {currentSportsCenter.phone} | {currentSportsCenter.email}</p>
                <p><strong>Sports:</strong> {currentSportsCenter.sports.map(s => s.name).join(', ')}</p>
                <p><strong>Amenities:</strong> {currentSportsCenter.amenities.join(', ')}</p>
              </Card>
            </TabPanel>
            
            <TabPanel $active={activeTab === 'bookings'}>
              {bookings.length > 0 ? (
                <Table>
                  <thead>
                    <tr>
                      <Th>ID</Th>
                      <Th>Facility</Th>
                      <Th>Date</Th>
                      <Th>Time</Th>
                      <Th>Price</Th>
                      <Th>Status</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking.id}>
                        <Td>{booking.id.substring(0, 8)}...</Td>
                        <Td>{getFacilityName(booking.facilityId)}</Td>
                        <Td>{formatDate(booking.startTime)}</Td>
                        <Td>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</Td>
                        <Td>{formatCurrency(booking.totalPrice)}</Td>
                        <Td>
                          <Badge $type={getStatusBadgeType(booking.status)}>
                            {booking.status}
                          </Badge>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <EmptyState>No bookings found</EmptyState>
              )}
            </TabPanel>
            
            <TabPanel $active={activeTab === 'facilities'}>
              {facilities.length > 0 ? (
                <Table>
                  <thead>
                    <tr>
                      <Th>Name</Th>
                      <Th>Sport</Th>
                      <Th>Capacity</Th>
                      <Th>Price/Hour</Th>
                      <Th>Type</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {facilities.map(facility => (
                      <tr key={facility.id}>
                        <Td>{facility.name}</Td>
                        <Td>
                          {currentSportsCenter.sports.find(s => s.id === facility.sportId)?.name || 'Unknown'}
                        </Td>
                        <Td>{facility.capacity} people</Td>
                        <Td>{formatCurrency(facility.pricePerHour)}</Td>
                        <Td>{facility.isIndoor ? 'Indoor' : 'Outdoor'}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <EmptyState>No facilities found</EmptyState>
              )}
            </TabPanel>
            
            <TabPanel $active={activeTab === 'promotions'}>
              {promotions.length > 0 ? (
                <Table>
                  <thead>
                    <tr>
                      <Th>Name</Th>
                      <Th>Discount</Th>
                      <Th>Valid Period</Th>
                      <Th>Code</Th>
                      <Th>Usage</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {promotions.map(promotion => (
                      <tr key={promotion.id}>
                        <Td>{promotion.name}</Td>
                        <Td>{promotion.discountPercentage}%</Td>
                        <Td>
                          {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                        </Td>
                        <Td><code>{promotion.code}</code></Td>
                        <Td>
                          {promotion.currentUsage} / {promotion.usageLimit || '∞'}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <EmptyState>No promotions found</EmptyState>
              )}
            </TabPanel>
            
            <TabPanel $active={activeTab === 'analytics'}>
              {analyticsData ? (
                <>
                  <Card>
                    <CardTitle>Revenue by Sport</CardTitle>
                    <ChartContainer>
                      <Chart>
                        Revenue Chart (Placeholder - Would use a real chart library)
                      </Chart>
                    </ChartContainer>
                  </Card>
                  
                  <Card>
                    <CardTitle>Popular Time Slots</CardTitle>
                    <ChartContainer>
                      <Chart>
                        Time Slots Chart (Placeholder - Would use a real chart library)
                      </Chart>
                    </ChartContainer>
                  </Card>
                </>
              ) : (
                <EmptyState>
                  No analytics data available
                  <div style={{ marginTop: '1rem' }}>
                    <Button onClick={loadAnalytics} disabled={loading}>
                      {loading ? 'Loading...' : 'Generate Analytics'}
                    </Button>
                  </div>
                </EmptyState>
              )}
            </TabPanel>
          </TabsContainer>
        </>
      ) : (
        <EmptyState>
          No sports center selected or you don't have any sports centers yet.
        </EmptyState>
      )}
    </Container>
  );
};

export default SportsCenterDashboard; 