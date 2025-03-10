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

const TestAccountsSection = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const TestAccountsTitle = styled.h3`
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

const TestAccountsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

const TestAccount = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: #f7fafc;
  border-radius: 4px;
  
  &:hover {
    background-color: #edf2f7;
  }
`;

const TestAccountButton = styled.button`
  background: none;
  border: none;
  color: #3182ce;
  cursor: pointer;
  font-size: 0.75rem;
  
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
  
  // Add test accounts section for development and testing
  const renderTestAccounts = () => {
    // Only show in development environment
    if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
      return null;
    }
    
    const testAccounts = [
      { type: 'User', email: 'user@example.com', password: 'User123!' },
      { type: 'Premium User', email: 'premium@example.com', password: 'Premium123!' },
      { type: 'Sports Center', email: 'admin@lasportscomplex.com', password: 'LAcomplex123' }
    ];
    
    const handleUseTestAccount = (email: string, password: string) => {
      setEmail(email);
      setPassword(password);
    };
    
    return (
      <TestAccountsSection data-testid="test-accounts-section">
        <TestAccountsTitle>Test Accounts (Development Only)</TestAccountsTitle>
        <TestAccountsList>
          {testAccounts.map((account) => (
            <TestAccount key={account.email}>
              <div>
                <strong>{account.type}:</strong> {account.email}
              </div>
              <TestAccountButton
                type="button"
                onClick={() => handleUseTestAccount(account.email, account.password)}
                data-testid={`use-${account.type.toLowerCase().replace(/\s+/g, '-')}-account`}
              >
                Use this account
              </TestAccountButton>
            </TestAccount>
          ))}
        </TestAccountsList>
      </TestAccountsSection>
    );
  };
  
  return (
    <LoginContainer>
      <Title>{isLogin ? 'Log In' : 'Create Account'}</Title>
      
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
            Forgot Password?
          </ForgotPassword>
        )}
        
        <Button 
          type="submit" 
          disabled={loading}
          data-testid="submit-button"
        >
          {loading && !googleSignInAttempted ? (
            <LoadingContainer>
              <LoadingSpinner />
              Loading...
            </LoadingContainer>
          ) : (
            isLogin ? 'Log In' : 'Create Account'
          )}
        </Button>
        
        <Divider>
          <DividerText>OR</DividerText>
        </Divider>
        
        <GoogleButton 
          type="button" 
          onClick={handleGoogleSignIn}
          disabled={loading}
          data-testid="google-signin-button"
        >
          {loading && googleSignInAttempted ? (
            <LoadingContainer>
              <LoadingSpinner />
              Connecting...
            </LoadingContainer>
          ) : (
            <>
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              Continue with Google
            </>
          )}
        </GoogleButton>
      </Form>
      
      <ToggleContainer>
        <ToggleButton 
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setSuccess('');
          }}
          data-testid="toggle-mode-button"
        >
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
        </ToggleButton>
      </ToggleContainer>
      
      {error && <ErrorMessage data-testid="error-message">{error}</ErrorMessage>}
      
      {resetSent && (
        <ResetPasswordContainer>
          <ResetPasswordButton 
            onClick={() => setResetSent(false)}
            data-testid="back-to-login-button"
          >
            Back to login
          </ResetPasswordButton>
        </ResetPasswordContainer>
      )}
      
      {success && (
        <div>
          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
              {success}
            </LoadingContainer>
          ) : (
            <SuccessMessage data-testid="success-message">{success}</SuccessMessage>
          )}
        </div>
      )}
      
      {renderTestAccounts()}
    </LoginContainer>
  );
};

export default Login; 