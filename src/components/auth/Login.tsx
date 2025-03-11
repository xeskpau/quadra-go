import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

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

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #3182ce;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
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
  
  &::before {
    margin-right: 0.5rem;
  }
  
  &::after {
    margin-left: 0.5rem;
  }
`;

const DividerText = styled.span`
  color: #a0aec0;
  font-size: 0.875rem;
`;

const ForgotPassword = styled.button`
  background: none;
  border: none;
  color: #3182ce;
  cursor: pointer;
  font-size: 0.875rem;
  text-align: right;
  margin-top: -0.5rem;
  align-self: flex-end;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ResetPasswordContainer = styled.div`
  margin-top: 1rem;
  text-align: center;
`;

const ResetPasswordButton = styled.button`
  background: none;
  border: none;
  color: #3182ce;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const TestAccountsContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background-color: #f8fafc;
`;

const TestAccountsTitle = styled.h3`
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 1rem;
`;

const TestAccountsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TestAccount = styled.button`
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0.75rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f1f5f9;
  }
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: #0072ff;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-top: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
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
  const { login, signInWithGoogle, resetPassword, userRole } = useAuth();
  const navigate = useCustomNavigate();
  const location = useLocation();
  
  // Get the role from location state or default to 'user'
  const role = (location.state as any)?.role || 'user';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  
  const handleRedirectAfterLogin = () => {
    if (onClose) {
      onClose();
    } else {
      // Redirect based on role
      if (role === 'sports_center_admin' || role === 'sports_center_staff') {
        navigate('/sports-center');
      } else {
        navigate('/discover');
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Pass the role to the login function
      await login(email, password, role as any);
      
      setSuccess('Login successful!');
      handleRedirectAfterLogin();
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      
      await signInWithGoogle();
      
      // Note: We can't set the role with Google sign-in directly
      // This would need to be handled in the backend
      
      setSuccess('Login successful!');
      handleRedirectAfterLogin();
    } catch (err: any) {
      setError(err.message || 'Failed to log in with Google');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await resetPassword(forgotPasswordEmail);
      
      setSuccess('Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Render test accounts based on the selected role
  const renderTestAccounts = () => {
    if (role === 'sports_center_admin') {
      return (
        <TestAccountsContainer>
          <TestAccountsTitle>Test Sports Center Accounts</TestAccountsTitle>
          <TestAccountsList>
            <TestAccount onClick={() => handleUseTestAccount('admin@lasportscomplex.com', 'LAcomplex123')}>
              Los Angeles Sports Complex
            </TestAccount>
            <TestAccount onClick={() => handleUseTestAccount('admin@sfsportshub.com', 'SFhub123')}>
              San Francisco Sports Hub
            </TestAccount>
          </TestAccountsList>
        </TestAccountsContainer>
      );
    }
    
    // For regular users
    return (
      <TestAccountsContainer>
        <TestAccountsTitle>Test User Accounts</TestAccountsTitle>
        <TestAccountsList>
          <TestAccount onClick={() => handleUseTestAccount('user@example.com', 'User123!')}>
            Regular User
          </TestAccount>
          <TestAccount onClick={() => handleUseTestAccount('premium@example.com', 'Premium123!')}>
            Premium User
          </TestAccount>
        </TestAccountsList>
      </TestAccountsContainer>
    );
  };
  
  const handleUseTestAccount = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };
  
  // Get the title based on the role
  const getTitle = () => {
    switch (role) {
      case 'sports_center_admin':
        return 'Sports Center Admin Login';
      case 'sports_center_staff':
        return 'Sports Center Staff Login';
      default:
        return 'User Login';
    }
  };
  
  if (showForgotPassword) {
    return (
      <LoginContainer>
        <Title>Reset Password</Title>
        <Form onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }}>
          <Input
            type="email"
            placeholder="Email"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            required
            data-testid="forgot-password-email"
          />
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <Button type="submit" disabled={loading} data-testid="reset-password-button">
            {loading ? (
              <>
                <LoadingSpinner />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
          
          <TextButton onClick={() => setShowForgotPassword(false)} data-testid="back-to-login">
            Back to Login
          </TextButton>
        </Form>
      </LoginContainer>
    );
  }
  
  return (
    <LoginContainer>
      <Title>{getTitle()}</Title>
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
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <Button type="submit" disabled={loading} data-testid="login-submit">
          {loading ? (
            <>
              <LoadingSpinner />
              Logging in...
            </>
          ) : (
            'Log In'
          )}
        </Button>
        
        {role === 'user' && (
          <GoogleButton type="button" onClick={handleGoogleSignIn} disabled={loading} data-testid="google-login">
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Sign in with Google
          </GoogleButton>
        )}
        
        <TextButton onClick={() => setShowForgotPassword(true)} data-testid="forgot-password">
          Forgot Password?
        </TextButton>
      </Form>
      
      {process.env.NODE_ENV !== 'production' && renderTestAccounts()}
    </LoginContainer>
  );
};

export default Login; 