import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SportsCenterList from '../../components/SportsCenterList';

const mockSportsCenters = [
  {
    id: '1',
    name: 'Tennis Club',
    sports: ['Tennis'],
    address: '123 Sports St',
    rating: 4.5,
    availableSlots: 5,
  },
  {
    id: '2',
    name: 'Soccer Arena',
    sports: ['Soccer'],
    address: '456 Game Ave',
    rating: 4.0,
    availableSlots: 3,
  },
];

describe('SportsCenterList Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <SportsCenterList sportsCenters={mockSportsCenters} />
      </BrowserRouter>
    );
  });

  it('renders all sports centers', () => {
    expect(screen.getByText('Tennis Club')).toBeInTheDocument();
    expect(screen.getByText('Soccer Arena')).toBeInTheDocument();
  });

  it('displays sports center details', () => {
    expect(screen.getByText('123 Sports St')).toBeInTheDocument();
    expect(screen.getByText('456 Game Ave')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('4.0')).toBeInTheDocument();
  });

  it('shows available slots', () => {
    expect(screen.getByText('5 slots available')).toBeInTheDocument();
    expect(screen.getByText('3 slots available')).toBeInTheDocument();
  });

  it('filters sports centers by sport', () => {
    const filterSelect = screen.getByLabelText(/filter by sport/i);
    fireEvent.change(filterSelect, { target: { value: 'Tennis' } });

    expect(screen.getByText('Tennis Club')).toBeInTheDocument();
    expect(screen.queryByText('Soccer Arena')).not.toBeInTheDocument();
  });
}); 