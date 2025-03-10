import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useSportsCenter } from '../../contexts/SportsCenterContext';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #2d3748;
  margin-bottom: 1.5rem;
  text-align: center;
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
  font-weight: 600;
  color: #4a5568;
`;

const Input = styled.input`
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

const Select = styled.select`
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

const Button = styled.button`
  background-color: #0072ff;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem;
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

const ErrorMessage = styled.p`
  color: #e53e3e;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.p`
  color: #38a169;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

interface SportsCenterRegistrationProps {
  onRegistrationComplete?: () => void;
}

const SportsCenterRegistration: React.FC<SportsCenterRegistrationProps> = ({ 
  onRegistrationComplete 
}) => {
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'admin' | 'staff'>('admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();
  const { registerAsSportsCenter } = useSportsCenter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to register as a sports center');
      return;
    }
    
    if (!displayName.trim()) {
      setError('Please enter a display name');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const result = await registerAsSportsCenter(displayName, role);
      
      if (result) {
        setSuccess('Registration successful!');
        
        if (onRegistrationComplete) {
          setTimeout(() => {
            onRegistrationComplete();
          }, 1500);
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <Title>Register as a Sports Center</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your sports center name"
            required
            data-testid="display-name-input"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="role">Role</Label>
          <Select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'staff')}
            required
            data-testid="role-select"
          >
            <option value="admin">Administrator</option>
            <option value="staff">Staff Member</option>
          </Select>
        </FormGroup>
        
        {error && <ErrorMessage data-testid="error-message">{error}</ErrorMessage>}
        {success && <SuccessMessage data-testid="success-message">{success}</SuccessMessage>}
        
        <Button 
          type="submit" 
          disabled={loading}
          data-testid="register-button"
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </Form>
    </Container>
  );
};

export default SportsCenterRegistration; 