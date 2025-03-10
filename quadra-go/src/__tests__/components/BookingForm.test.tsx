import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingForm from '../../components/BookingForm';

const mockOnSubmit = jest.fn();
const mockAvailableSlots = [
  { id: '1', startTime: '09:00', endTime: '10:00', date: '2024-03-15' },
  { id: '2', startTime: '10:00', endTime: '11:00', date: '2024-03-15' },
];

describe('BookingForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <BookingForm
        sportsCenterId="123"
        availableSlots={mockAvailableSlots}
        onSubmit={mockOnSubmit}
      />
    );
  });

  it('renders booking form elements', () => {
    expect(screen.getByLabelText(/select date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select time slot/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /book now/i })).toBeInTheDocument();
  });

  it('shows available time slots for selected date', async () => {
    const dateInput = screen.getByLabelText(/select date/i);
    await userEvent.type(dateInput, '2024-03-15');

    expect(screen.getByText('09:00 - 10:00')).toBeInTheDocument();
    expect(screen.getByText('10:00 - 11:00')).toBeInTheDocument();
  });

  it('submits booking with selected slot', async () => {
    // Set the date
    const dateInput = screen.getByLabelText(/select date/i);
    fireEvent.change(dateInput, { target: { value: '2024-03-15' } });

    // Select the time slot
    const timeSlotSelect = screen.getByLabelText(/select time slot/i);
    fireEvent.change(timeSlotSelect, { target: { value: '1' } });

    // Submit the form
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        sportsCenterId: '123',
        slotId: '1',
        date: '2024-03-15',
      });
    });
  });

  it('shows validation error when no slot is selected', async () => {
    const bookButton = screen.getByRole('button', { name: /book now/i });
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(screen.getByText(/please select a time slot/i)).toBeInTheDocument();
    });
  });

  it('disables past dates in date picker', () => {
    const dateInput = screen.getByLabelText(/select date/i);
    const today = new Date().toISOString().split('T')[0];
    expect(dateInput).toHaveAttribute('min', today);
  });
}); 