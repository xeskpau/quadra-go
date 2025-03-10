import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--primary-color);
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
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

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    background-color: #3d8b40;
  }
  
  &:disabled {
    background-color: var(--medium-gray);
    cursor: not-allowed;
  }
`;

const GoogleButton = styled(Button)`
  background-color: #4285F4;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  
  &:hover {
    background-color: #3367D6;
  }
`;

const ErrorMessage = styled.p`
  color: var(--error-color);
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--medium-gray);
  }
  
  span {
    padding: 0 10px;
    color: var(--dark-gray);
  }
`;

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginWithGoogle, isLoading, error } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
    } catch (err) {
      // Error is handled in the AuthContext
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      // Error is handled in the AuthContext
    }
  };
  
  return (
    <FormContainer>
      <Title>Log In</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
      
      <Divider>
        <span>OR</span>
      </Divider>
      
      <GoogleButton type="button" onClick={handleGoogleLogin} disabled={isLoading}>
        Continue with Google
      </GoogleButton>
    </FormContainer>
  );
};

export default LoginForm; 