import React, { useState } from 'react';
import styled from 'styled-components';
import { useSportsCenter } from '../../contexts/SportsCenterContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Container = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 500px;
  margin: 0 auto;
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
  font-weight: 500;
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

const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const RadioInput = styled.input`
  cursor: pointer;
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

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0072ff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const InvitationSection = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const InvitationTitle = styled.h3`
  font-size: 1.2rem;
  color: #4a5568;
  margin-bottom: 1rem;
`;

const SportsCenterRegistration: React.FC = () => {
  const { registerAsSportsCenter, acceptInvitation, error: contextError } = useSportsCenter();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if there's an invitation token in the URL
  const queryParams = new URLSearchParams(location.search);
  const invitationToken = queryParams.get('token');
  
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'admin' | 'staff'>('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName) {
      setError('Please enter a display name');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // If there's an invitation token, accept the invitation
      if (invitationToken) {
        const result = await acceptInvitation(invitationToken);
        
        if (result) {
          setSuccess('Invitation accepted successfully!');
          setTimeout(() => {
            navigate('/sports-center');
          }, 1500);
        }
      } else {
        // Otherwise, register as a new sports center user
        const result = await registerAsSportsCenter(displayName, role);
        
        if (result) {
          setSuccess('Registration successful!');
          setTimeout(() => {
            navigate('/sports-center');
          }, 1500);
        }
      }
    } catch (err) {
      setError(contextError || 'Registration failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (!currentUser) {
    return (
      <Container>
        <Title>Sports Center Registration</Title>
        <p>You must be logged in to register as a sports center.</p>
        <Button onClick={() => navigate('/login')}>
          Log In
        </Button>
      </Container>
    );
  }
  
  return (
    <Container>
      <Title>
        {invitationToken ? 'Accept Staff Invitation' : 'Sports Center Registration'}
      </Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your name or business name"
            required
            data-testid="display-name-input"
          />
        </FormGroup>
        
        {!invitationToken && (
          <FormGroup>
            <Label>Role</Label>
            <RadioGroup>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  data-testid="admin-role-radio"
                />
                Admin (Owner)
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="role"
                  value="staff"
                  checked={role === 'staff'}
                  onChange={() => setRole('staff')}
                  data-testid="staff-role-radio"
                />
                Staff
              </RadioLabel>
            </RadioGroup>
          </FormGroup>
        )}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <Button type="submit" disabled={loading} data-testid="register-button">
          {loading ? (
            <>
              <LoadingSpinner />
              {invitationToken ? 'Accepting...' : 'Registering...'}
            </>
          ) : (
            invitationToken ? 'Accept Invitation' : 'Register'
          )}
        </Button>
      </Form>
      
      {!invitationToken && (
        <InvitationSection>
          <InvitationTitle>Already have an invitation?</InvitationTitle>
          <p>If you received an invitation to join a sports center as staff, please use the link in the invitation email.</p>
        </InvitationSection>
      )}
    </Container>
  );
};

export default SportsCenterRegistration; 