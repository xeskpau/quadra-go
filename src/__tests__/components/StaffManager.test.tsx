import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import StaffManager from '../../components/sportsCenter/StaffManager';
import { useSportsCenter } from '../../contexts/SportsCenterContext';
import { SportsCenter, SportsCenterUser, StaffInvitation } from '../../types';

// Mock the SportsCenterContext
jest.mock('../../contexts/SportsCenterContext');

// Mock window.confirm
const originalConfirm = window.confirm;
window.confirm = jest.fn();

describe('StaffManager Component', () => {
  // Mock data
  const mockSportsCenter: SportsCenter = {
    id: 'center1',
    name: 'Tennis Club',
    description: 'A premium tennis club',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '123-456-7890',
    email: 'info@tennisclub.com',
    website: 'https://tennisclub.com',
    photoURL: 'https://example.com/tennis.jpg',
    coverPhotoURL: 'https://example.com/tennis-cover.jpg',
    ownerId: 'owner1',
    staffIds: ['staff1', 'staff2'],
    sports: [],
    location: { latitude: 40.7128, longitude: -74.0060 },
    amenities: ['Parking', 'Showers'],
    openingHours: {
      'Monday': { open: '08:00', close: '22:00' },
      'Tuesday': { open: '08:00', close: '22:00' },
      'Wednesday': { open: '08:00', close: '22:00' },
      'Thursday': { open: '08:00', close: '22:00' },
      'Friday': { open: '08:00', close: '22:00' },
      'Saturday': { open: '09:00', close: '20:00' },
      'Sunday': { open: '09:00', close: '18:00' }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockAdminUser: SportsCenterUser = {
    id: 'admin1',
    email: 'admin@example.com',
    displayName: 'Admin User',
    role: 'admin',
    status: 'active',
    createdAt: new Date(),
    sportsCenterId: 'center1'
  };

  const mockStaffUser: SportsCenterUser = {
    id: 'staff1',
    email: 'staff@example.com',
    displayName: 'Staff User',
    role: 'staff',
    status: 'active',
    createdAt: new Date(),
    sportsCenterId: 'center1',
    invitedBy: 'admin1'
  };

  const mockInvitations: StaffInvitation[] = [
    {
      id: 'invitation1',
      sportsCenterId: 'center1',
      email: 'newinvite@example.com',
      invitedBy: 'admin1',
      invitedAt: new Date(),
      status: 'pending',
      token: 'token123',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }
  ];

  // Mock functions
  const mockInviteStaff = jest.fn();
  const mockRevokeStaff = jest.fn();
  const mockRefreshStaffInvitations = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation for admin user
    (useSportsCenter as jest.Mock).mockReturnValue({
      currentSportsCenter: mockSportsCenter,
      sportsCenterUser: mockAdminUser,
      staffInvitations: mockInvitations,
      inviteStaff: mockInviteStaff,
      revokeStaff: mockRevokeStaff,
      refreshStaffInvitations: mockRefreshStaffInvitations,
      error: null
    });

    // Reset window.confirm mock
    (window.confirm as jest.Mock).mockReset();
  });

  afterAll(() => {
    window.confirm = originalConfirm;
  });

  test('renders staff management page for admin user', () => {
    render(<StaffManager />);
    
    // Check if the title is rendered
    expect(screen.getByText('Staff Management')).toBeInTheDocument();
    
    // Check if the invite form is rendered
    expect(screen.getByText('Invite Staff Member')).toBeInTheDocument();
    expect(screen.getByTestId('staff-email-input')).toBeInTheDocument();
    expect(screen.getByTestId('invite-staff-button')).toBeInTheDocument();
    
    // Check if the pending invitations section is rendered
    expect(screen.getByText('Pending Invitations')).toBeInTheDocument();
    expect(screen.getByText('newinvite@example.com')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    
    // Check if the active staff members section is rendered
    expect(screen.getByText('Active Staff Members')).toBeInTheDocument();
  });

  test('shows access denied message for non-admin users', () => {
    // Mock non-admin user
    (useSportsCenter as jest.Mock).mockReturnValue({
      currentSportsCenter: mockSportsCenter,
      sportsCenterUser: mockStaffUser,
      staffInvitations: mockInvitations,
      inviteStaff: mockInviteStaff,
      revokeStaff: mockRevokeStaff,
      refreshStaffInvitations: mockRefreshStaffInvitations,
      error: null
    });
    
    render(<StaffManager />);
    
    // Check if access denied message is shown
    expect(screen.getByText('Staff Management')).toBeInTheDocument();
    expect(screen.getByText('You do not have permission to manage staff members.')).toBeInTheDocument();
    
    // Check that the invite form is not rendered
    expect(screen.queryByText('Invite Staff Member')).not.toBeInTheDocument();
  });

  test('handles staff invitation submission', async () => {
    mockInviteStaff.mockResolvedValue({ id: 'new-invitation', email: 'test@example.com' });
    
    render(<StaffManager />);
    
    // Fill in the email input
    fireEvent.change(screen.getByTestId('staff-email-input'), {
      target: { value: 'test@example.com' }
    });
    
    // Submit the form
    fireEvent.submit(screen.getByTestId('staff-email-input').closest('form')!);
    
    // Check if the invite function was called with the correct email
    expect(mockInviteStaff).toHaveBeenCalledWith('test@example.com');
    
    // Check if the refresh function was called
    await waitFor(() => {
      expect(mockRefreshStaffInvitations).toHaveBeenCalled();
    });
  });

  test('handles invitation error', async () => {
    // Mock an error
    mockInviteStaff.mockRejectedValue(new Error('Failed to send invitation'));
    
    render(<StaffManager />);
    
    // Fill in the email input
    fireEvent.change(screen.getByTestId('staff-email-input'), {
      target: { value: 'test@example.com' }
    });
    
    // Submit the form
    fireEvent.submit(screen.getByTestId('staff-email-input').closest('form')!);
    
    // Check if the invite function was called
    expect(mockInviteStaff).toHaveBeenCalledWith('test@example.com');
  });

  test('displays error from context', () => {
    // Mock context with error
    (useSportsCenter as jest.Mock).mockReturnValue({
      currentSportsCenter: mockSportsCenter,
      sportsCenterUser: mockAdminUser,
      staffInvitations: mockInvitations,
      inviteStaff: mockInviteStaff,
      revokeStaff: mockRevokeStaff,
      refreshStaffInvitations: mockRefreshStaffInvitations,
      error: 'Context error message'
    });
    
    render(<StaffManager />);
    
    // Check if the error message is shown
    expect(screen.getByText('Context error message')).toBeInTheDocument();
  });

  test('handles empty invitations list', () => {
    // Mock empty invitations
    (useSportsCenter as jest.Mock).mockReturnValue({
      currentSportsCenter: mockSportsCenter,
      sportsCenterUser: mockAdminUser,
      staffInvitations: [],
      inviteStaff: mockInviteStaff,
      revokeStaff: mockRevokeStaff,
      refreshStaffInvitations: mockRefreshStaffInvitations,
      error: null
    });
    
    render(<StaffManager />);
    
    // Check if the empty state message is shown
    expect(screen.getByText('No pending invitations')).toBeInTheDocument();
  });

  test('handles cancelling invitation when confirmed', async () => {
    // Mock confirm to return true
    (window.confirm as jest.Mock).mockReturnValue(true);
    
    render(<StaffManager />);
    
    // Find the cancel button using data-testid
    const cancelButton = screen.getByTestId('cancel-invitation-invitation1');
    
    // Click the cancel button
    await act(async () => {
      fireEvent.click(cancelButton);
    });
    
    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to cancel this invitation?');
    
    // Check if the refresh function was called
    await waitFor(() => {
      expect(mockRefreshStaffInvitations).toHaveBeenCalled();
    });
  });

  test('does not cancel invitation when not confirmed', async () => {
    // Mock confirm to return false
    (window.confirm as jest.Mock).mockReturnValue(false);
    
    render(<StaffManager />);
    
    // Find the cancel button using data-testid
    const cancelButton = screen.getByTestId('cancel-invitation-invitation1');
    
    // Click the cancel button
    await act(async () => {
      fireEvent.click(cancelButton);
    });
    
    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to cancel this invitation?');
    
    // Check that the refresh function was NOT called
    expect(mockRefreshStaffInvitations).not.toHaveBeenCalled();
  });

  test('handles revoking staff access when confirmed', async () => {
    // Mock active staff members
    (useSportsCenter as jest.Mock).mockReturnValue({
      currentSportsCenter: mockSportsCenter,
      sportsCenterUser: mockAdminUser,
      staffInvitations: mockInvitations,
      inviteStaff: mockInviteStaff,
      revokeStaff: mockRevokeStaff,
      refreshStaffInvitations: mockRefreshStaffInvitations,
      error: null
    });

    // Mock confirm to return true
    (window.confirm as jest.Mock).mockReturnValue(true);
    
    // Mock successful revoke
    mockRevokeStaff.mockResolvedValue(undefined);
    
    render(<StaffManager />);
    
    // Find the revoke button using data-testid
    const revokeButton = screen.getByTestId('revoke-staff-staff1');
    
    // Click the revoke button
    await act(async () => {
      fireEvent.click(revokeButton);
    });
    
    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to revoke access for this staff member?');
    
    // Check if the revoke function was called with the correct staff ID
    expect(mockRevokeStaff).toHaveBeenCalledWith('staff1');
  });

  test('does not revoke staff access when not confirmed', async () => {
    // Mock confirm to return false
    (window.confirm as jest.Mock).mockReturnValue(false);
    
    render(<StaffManager />);
    
    // Find the revoke button using data-testid
    const revokeButton = screen.getByTestId('revoke-staff-staff1');
    
    // Click the revoke button
    await act(async () => {
      fireEvent.click(revokeButton);
    });
    
    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to revoke access for this staff member?');
    
    // Check that the revoke function was NOT called
    expect(mockRevokeStaff).not.toHaveBeenCalled();
  });

  test('handles error when revoking staff access', async () => {
    // Mock confirm to return true
    (window.confirm as jest.Mock).mockReturnValue(true);
    
    // Mock error when revoking
    mockRevokeStaff.mockRejectedValue(new Error('Failed to revoke staff access'));
    
    render(<StaffManager />);
    
    // Find the revoke button using data-testid
    const revokeButton = screen.getByTestId('revoke-staff-staff1');
    
    // Click the revoke button
    await act(async () => {
      fireEvent.click(revokeButton);
    });
    
    // Check if the revoke function was called
    expect(mockRevokeStaff).toHaveBeenCalled();
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to revoke staff access')).toBeInTheDocument();
    });
  });
}); 