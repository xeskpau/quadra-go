import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import Login from '../../components/auth/Login';
import { useAuth } from '../../contexts/AuthContext';

// Mock the auth context
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock the react-router-dom hooks
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useLocation: jest.fn(),
    useNavigate: jest.fn()
  };
});

// Helper function to render with router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {ui}
    </MemoryRouter>
  );
};

describe('Login Component', () => {
  // Mock functions
  const mockLogin = jest.fn();
  const mockSignInWithGoogle = jest.fn();
  const mockResetPassword = jest.fn();
  const mockNavigate = jest.fn();
  const mockOnClose = jest.fn();
  
  // Clean up after each test
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });
  
  beforeEach(() => {
    // Default mock implementations
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      register: jest.fn(),
      signInWithGoogle: mockSignInWithGoogle,
      resetPassword: mockResetPassword,
      currentUser: null,
      userRole: 'user'
    });
    
    (useLocation as jest.Mock).mockReturnValue({ state: null });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });
  
  test('renders login form by default', () => {
    // Mock useLocation to return default state
    (useLocation as jest.Mock).mockReturnValue({ state: null });
    
    renderWithRouter(<Login />);
    
    // Use heading instead of text
    expect(screen.getByRole('heading', { name: /User Login/i })).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-submit')).toHaveTextContent('Log In');
    expect(screen.getByTestId('google-login')).toBeInTheDocument();
  });
  
  test('shows forgot password functionality', async () => {
    // Mock useLocation to return default state
    (useLocation as jest.Mock).mockReturnValue({ state: null });
    
    renderWithRouter(<Login />);
    
    // Should show forgot password button in login mode
    const forgotPasswordButton = screen.getByTestId('forgot-password');
    expect(forgotPasswordButton).toBeInTheDocument();
    
    // Click on forgot password
    fireEvent.click(forgotPasswordButton);
    
    // Should now show the reset password form
    expect(screen.getByRole('heading', { name: /Reset Password/i })).toBeInTheDocument();
    expect(screen.getByTestId('forgot-password-email')).toBeInTheDocument();
    expect(screen.getByTestId('reset-password-button')).toBeInTheDocument();
    
    // Should be able to go back to login
    const backButton = screen.getByTestId('back-to-login');
    fireEvent.click(backButton);
    
    // Should be back in login mode
    expect(screen.getByRole('heading', { name: /User Login/i })).toBeInTheDocument();
  });
  
  test('handles form submission', async () => {
    // Mock useLocation to return default state
    (useLocation as jest.Mock).mockReturnValue({ state: null });
    mockLogin.mockResolvedValue({});
    
    renderWithRouter(<Login />);
    
    // Fill out the form
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByTestId('login-submit'));
    
    // Check if login was called with correct parameters
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123', 'user');
    
    // Check if navigation was called
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/discover');
    });
  });
  
  test('handles Google sign-in', async () => {
    // Mock useLocation to return default state
    (useLocation as jest.Mock).mockReturnValue({ state: null });
    mockSignInWithGoogle.mockResolvedValue({});
    
    renderWithRouter(<Login />);
    
    // Click the Google button
    fireEvent.click(screen.getByTestId('google-login'));
    
    // Check if signInWithGoogle was called
    expect(mockSignInWithGoogle).toHaveBeenCalled();
    
    // Check if navigation was called
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/discover');
    });
  });
  
  test('shows different titles based on role', () => {
    // First render with user role (default)
    (useLocation as jest.Mock).mockReturnValue({ state: null });
    renderWithRouter(<Login />);
    expect(screen.getByRole('heading', { name: /User Login/i })).toBeInTheDocument();
    
    // Clean up
    cleanup();
    
    // Then render with sports center admin role
    (useLocation as jest.Mock).mockReturnValue({ 
      state: { role: 'sports_center_admin' },
      pathname: '',
      search: '',
      hash: '',
      key: 'test'
    });
    
    renderWithRouter(<Login />);
    expect(screen.getByRole('heading', { name: /Sports Center Admin Login/i })).toBeInTheDocument();
    
    // Clean up
    cleanup();
    
    // Then render with sports center staff role
    (useLocation as jest.Mock).mockReturnValue({ 
      state: { role: 'sports_center_staff' },
      pathname: '',
      search: '',
      hash: '',
      key: 'test'
    });
    
    renderWithRouter(<Login />);
    expect(screen.getByRole('heading', { name: /Sports Center Staff Login/i })).toBeInTheDocument();
  });
  
  test('handles forgot password submission', async () => {
    // Mock useLocation to return default state
    (useLocation as jest.Mock).mockReturnValue({ state: null });
    mockResetPassword.mockResolvedValue({});
    
    renderWithRouter(<Login />);
    
    // Click on forgot password
    fireEvent.click(screen.getByTestId('forgot-password'));
    
    // Fill out the email
    fireEvent.change(screen.getByTestId('forgot-password-email'), {
      target: { value: 'reset@example.com' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByTestId('reset-password-button'));
    
    // Check if resetPassword was called with correct email
    expect(mockResetPassword).toHaveBeenCalledWith('reset@example.com');
    
    // Check if success message is shown by text content
    await waitFor(() => {
      expect(screen.getByText('Password reset email sent! Check your inbox.')).toBeInTheDocument();
    });
  });
  
  test('handles login error', async () => {
    // Mock login to throw an error
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    
    renderWithRouter(<Login />);
    
    // Fill out the form
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByTestId('login-submit'));
    
    // Check if error message is shown by text content
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
  
  test('redirects to sports center page for admin role', async () => {
    // Mock admin role
    (useLocation as jest.Mock).mockReturnValue({ 
      state: { role: 'sports_center_admin' },
      pathname: '',
      search: '',
      hash: '',
      key: 'test'
    });
    
    mockLogin.mockResolvedValue({});
    
    renderWithRouter(<Login />);
    
    // Fill out the form
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'admin@example.com' }
    });
    
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByTestId('login-submit'));
    
    // Check if navigation was called with sports center path
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/sports-center');
    });
  });
  
  test('calls onClose when provided', async () => {
    mockLogin.mockResolvedValue({});
    
    render(<Login onClose={mockOnClose} />);
    
    // Fill out the form
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByTestId('login-submit'));
    
    // Check if onClose was called
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
    
    // Check that navigate was not called
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  
  test('handles using test account', () => {
    renderWithRouter(<Login />);
    
    // Find and click a test account button
    const testAccountButton = screen.getByText('Regular User');
    fireEvent.click(testAccountButton);
    
    // Check if the email and password fields were filled
    expect(screen.getByTestId('email-input')).toHaveValue('user@example.com');
    expect(screen.getByTestId('password-input')).toHaveValue('User123!');
  });
  
  test('renders sports center test accounts for admin role', () => {
    // Mock admin role
    (useLocation as jest.Mock).mockReturnValue({ 
      state: { role: 'sports_center_admin' },
      pathname: '',
      search: '',
      hash: '',
      key: 'test'
    });
    
    renderWithRouter(<Login />);
    
    // Check if sports center test accounts are shown
    expect(screen.getByText('Test Sports Center Accounts')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles Sports Complex')).toBeInTheDocument();
    expect(screen.getByText('San Francisco Sports Hub')).toBeInTheDocument();
  });
}); 