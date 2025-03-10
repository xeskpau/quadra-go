import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
}

interface BookingFormProps {
  sportsCenterId: string;
  availableSlots: TimeSlot[];
  onSubmit: (booking: { sportsCenterId: string; slotId: string; date: string }) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  sportsCenterId,
  availableSlots,
  onSubmit,
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const availableSlotsForDate = availableSlots.filter(
    slot => slot.date === selectedDate
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    onSubmit({
      sportsCenterId,
      slotId: selectedSlot,
      date: selectedDate,
    });
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit} role="form">
        <FormGroup>
          <Label htmlFor="date">Select date:</Label>
          <Input
            type="date"
            id="date"
            value={selectedDate}
            min={today}
            onChange={(e) => setSelectedDate(e.target.value)}
            data-testid="date-picker"
            aria-label="select date"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="time-slot">Select time slot:</Label>
          <Select
            id="time-slot"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            data-testid="time-slot-select"
            aria-label="select time slot"
          >
            <option value="">Choose a time slot</option>
            {availableSlotsForDate.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.startTime} - {slot.endTime}
              </option>
            ))}
          </Select>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </FormGroup>

        <Button type="submit" data-testid="book-button">
          Book Now
        </Button>
      </Form>
    </FormContainer>
  );
};

export default BookingForm; 