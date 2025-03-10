import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h2`
  color: #2d3748;
  margin-bottom: 1.5rem;
  text-align: center;
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

const GoogleButton = styled(Button)`
  background-color: white;
  color: #333;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #f8f9fa;
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

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e2e8f0;
  }
  
  span {
    padding: 0 0.75rem;
    color: #718096;
  }
`;

const ForgotPassword = styled.button`
  background: none;
  border: none;
  color: #0072ff;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 0.5rem;
  align-self: flex-end;
`;

const ToggleForm = styled.button`
  background: none;
  border: none;
  color: #0072ff;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 1rem;
  align-self: center;
`;

interface LoginProps {
  onClose?: () => void;
}

// Custom hook to handle navigation safely even in test environments
const useCustomNavigate = () => {
  try {
    // Try to use the real navigate if in a Router context
    return useNavigate();
  } catch (error) {
    // Mock navigate in test environment
    return (path: string) => {
      console.log(`Navigation to ${path} was called`);
      return undefined;
    };
  }
};

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [resetSent, setResetSent] = useState(false);
  const [googleSignInAttempted, setGoogleSignInAttempted] = useState(false);
  
  const { login, register, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useCustomNavigate();
  
  const handleRedirectAfterLogin = () => {
    setSuccess('Logged in successfully!');
    
    // Short delay to show success message before redirect
    setTimeout(() => {
      if (onClose) onClose();
      navigate('/feed');
    }, 1500); // Increased delay to make sure users see the success message
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
        handleRedirectAfterLogin();
      } else {
        await register(email, password);
        setSuccess('Account created successfully!');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    setGoogleSignInAttempted(true);
    
    try {
      // Let the user know we're processing the Google sign-in
      setSuccess('Connecting to Google...');
      
      const user = await signInWithGoogle();
      if (user) {
        handleRedirectAfterLogin();
      } else {
        setError('Google sign-in was cancelled or failed');
        setGoogleSignInAttempted(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred with Google Sign-in');
      setGoogleSignInAttempted(false);
    } finally {
      setLoading(false);
    }
  };
  
  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await resetPassword(email);
      setResetSent(true);
      setSuccess('Password reset email sent');
    } catch (err: any) {
      setError(err.message || 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <Title>{isLogin ? 'Log In' : 'Create Account'}</Title>
      
      {/* Don't show the form if Google sign-in is in progress and was successful */}
      {!googleSignInAttempted || error ? (
        <>
          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="email-input"
            />
            
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="password-input"
            />
            
            {isLogin && (
              <ForgotPassword 
                type="button" 
                onClick={handleForgotPassword}
                data-testid="forgot-password-button"
              >
                Forgot password?
              </ForgotPassword>
            )}
            
            <Button 
              type="submit" 
              disabled={loading}
              data-testid="submit-button"
            >
              {isLogin ? 'Log In' : 'Sign Up'}
            </Button>
            
            {error && <ErrorMessage data-testid="error-message">{error}</ErrorMessage>}
            {success && !googleSignInAttempted && <SuccessMessage data-testid="success-message">{success}</SuccessMessage>}
            {resetSent && (
              <SuccessMessage>
                Password reset link sent to your email
              </SuccessMessage>
            )}
          </Form>
          
          <Divider>
            <span>OR</span>
          </Divider>
          
          <GoogleButton 
            type="button" 
            onClick={handleGoogleSignIn}
            disabled={loading}
            data-testid="google-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </GoogleButton>
          
          <ToggleForm 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            data-testid="toggle-form-button"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Log in"
            }
          </ToggleForm>
        </>
      ) : (
        // Show a special view when Google sign-in is in progress
        <div>
          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
              <span>Processing Google authentication...</span>
            </LoadingContainer>
          ) : (
            <SuccessMessage data-testid="success-message">{success}</SuccessMessage>
          )}
        </div>
      )}
    </LoginContainer>
  );
};

export default Login;