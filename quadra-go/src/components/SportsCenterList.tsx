import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ListContainer = styled.div`
  padding: 1rem;
`;

const FilterContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled(Link)`
  display: block;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CenterName = styled.h3`
  margin: 0 0 0.5rem;
  color: #333;
`;

const Address = styled.p`
  margin: 0 0 0.5rem;
  color: #666;
`;

const Rating = styled.div`
  color: #f5a623;
  margin-bottom: 0.5rem;
`;

const Slots = styled.div`
  color: #28a745;
  font-size: 0.875rem;
`;

interface SportsCenter {
  id: string;
  name: string;
  sports: string[];
  address: string;
  rating: number;
  availableSlots: number;
}

interface SportsCenterListProps {
  sportsCenters: SportsCenter[];
}

const SportsCenterList: React.FC<SportsCenterListProps> = ({ sportsCenters }) => {
  const [selectedSport, setSelectedSport] = useState<string>('');

  const uniqueSports = Array.from(
    new Set(sportsCenters.flatMap(center => center.sports))
  );

  const filteredCenters = selectedSport
    ? sportsCenters.filter(center => center.sports.includes(selectedSport))
    : sportsCenters;

  return (
    <ListContainer>
      <FilterContainer>
        <label htmlFor="sport-filter">Filter by sport: </label>
        <Select
          id="sport-filter"
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
          aria-label="filter by sport"
        >
          <option value="">All Sports</option>
          {uniqueSports.map(sport => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </Select>
      </FilterContainer>

      <Grid>
        {filteredCenters.map(center => (
          <Card
            key={center.id}
            to={`/centers/${center.id}`}
            data-testid="sports-center-card"
          >
            <CenterName>{center.name}</CenterName>
            <Address>{center.address}</Address>
            <Rating>{center.rating.toFixed(1)}</Rating>
            <Slots>{center.availableSlots} slots available</Slots>
          </Card>
        ))}
      </Grid>
    </ListContainer>
  );
};

export default SportsCenterList; 