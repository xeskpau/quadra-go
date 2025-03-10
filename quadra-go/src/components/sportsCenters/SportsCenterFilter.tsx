import React, { useState } from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const FilterTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: var(--primary-color);
`;

const FilterForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const FilterGroup = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--medium-gray);
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--medium-gray);
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #3d8b40;
  }
`;

const ResetButton = styled(Button)`
  background-color: var(--medium-gray);
  color: var(--text-color);
  
  &:hover {
    background-color: var(--dark-gray);
    color: white;
  }
`;

interface FilterValues {
  sport: string;
  date: string;
  time: string;
}

interface SportsCenterFilterProps {
  onFilter: (filters: FilterValues) => void;
}

const SportsCenterFilter: React.FC<SportsCenterFilterProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState<FilterValues>({
    sport: '',
    date: '',
    time: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };
  
  const handleReset = () => {
    setFilters({
      sport: '',
      date: '',
      time: ''
    });
    onFilter({
      sport: '',
      date: '',
      time: ''
    });
  };
  
  // Get today's date in YYYY-MM-DD format for the date input min value
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <FilterContainer>
      <FilterTitle>Filter Sports Centers</FilterTitle>
      <FilterForm onSubmit={handleSubmit}>
        <FilterGroup>
          <Label htmlFor="sport">Sport</Label>
          <Select
            id="sport"
            name="sport"
            value={filters.sport}
            onChange={handleChange}
          >
            <option value="">All Sports</option>
            <option value="beach volley">Beach Volleyball</option>
            <option value="beach tennis">Beach Tennis</option>
            <option value="beach soccer">Beach Soccer</option>
          </Select>
        </FilterGroup>
        
        <FilterGroup>
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
            min={today}
          />
        </FilterGroup>
        
        <FilterGroup>
          <Label htmlFor="time">Time</Label>
          <Select
            id="time"
            name="time"
            value={filters.time}
            onChange={handleChange}
          >
            <option value="">Any Time</option>
            <option value="09:00">09:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="13:00">01:00 PM</option>
            <option value="14:00">02:00 PM</option>
            <option value="15:00">03:00 PM</option>
            <option value="16:00">04:00 PM</option>
            <option value="17:00">05:00 PM</option>
            <option value="18:00">06:00 PM</option>
            <option value="19:00">07:00 PM</option>
            <option value="20:00">08:00 PM</option>
          </Select>
        </FilterGroup>
        
        <ButtonGroup>
          <Button type="submit">Apply Filters</Button>
          <ResetButton type="button" onClick={handleReset}>Reset</ResetButton>
        </ButtonGroup>
      </FilterForm>
    </FilterContainer>
  );
};

export default SportsCenterFilter; 