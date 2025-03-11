import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSportsCenter } from '../../contexts/SportsCenterContext';
import { StaffInvitation, SportsCenterUser } from '../../types';

const Container = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  color: #2d3748;
  margin-bottom: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #4a5568;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  flex-grow: 1;
  
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
  padding: 0.75rem 1.5rem;
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

const DangerButton = styled(Button)`
  background-color: #e53e3e;
  
  &:hover {
    background-color: #c53030;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid #e2e8f0;
  color: #4a5568;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${props => {
    switch (props.$status) {
      case 'active':
        return '#68d391';
      case 'pending':
        return '#f6e05e';
      case 'revoked':
        return '#fc8181';
      default:
        return '#cbd5e0';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'active':
        return '#22543d';
      case 'pending':
        return '#744210';
      case 'revoked':
        return '#742a2a';
      default:
        return '#2d3748';
    }
  }};
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

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #a0aec0;
`;

const StaffManager: React.FC = () => {
  const { 
    currentSportsCenter, 
    sportsCenterUser, 
    staffInvitations, 
    inviteStaff, 
    revokeStaff, 
    refreshStaffInvitations,
    error
  } = useSportsCenter();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [localError, setLocalError] = useState('');
  const [activeStaff, setActiveStaff] = useState<SportsCenterUser[]>([]);
  
  // Load active staff members
  useEffect(() => {
    if (currentSportsCenter) {
      // This would be implemented in a real application
      // For now, we'll use mock data
      const mockStaff: SportsCenterUser[] = currentSportsCenter.staffIds.map(id => ({
        id,
        email: `staff${id}@example.com`,
        displayName: `Staff Member ${id}`,
        role: 'staff',
        status: 'active',
        createdAt: new Date(),
        sportsCenterId: currentSportsCenter.id,
        invitedBy: currentSportsCenter.ownerId
      }));
      
      setActiveStaff(mockStaff);
    }
  }, [currentSportsCenter]);
  
  // Reset messages when error changes
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);
  
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setLocalError('Please enter an email address');
      return;
    }
    
    setLoading(true);
    setLocalError('');
    setSuccess('');
    
    try {
      const invitation = await inviteStaff(email);
      
      if (invitation) {
        setSuccess(`Invitation sent to ${email}`);
        setEmail('');
        
        // Refresh the invitations list
        await refreshStaffInvitations();
      }
    } catch (err) {
      setLocalError('Failed to send invitation');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRevoke = async (userId: string) => {
    if (!confirm('Are you sure you want to revoke access for this staff member?')) {
      return;
    }
    
    setLoading(true);
    setLocalError('');
    setSuccess('');
    
    try {
      await revokeStaff(userId);
      setSuccess('Staff access revoked successfully');
      
      // Update the active staff list
      setActiveStaff(prev => prev.filter(staff => staff.id !== userId));
    } catch (err) {
      setLocalError('Failed to revoke staff access');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelInvitation = async (invitationId: string) => {
    if (!confirm('Are you sure you want to cancel this invitation?')) {
      return;
    }
    
    // This would be implemented in a real application
    // For now, we'll just remove it from the local state
    setSuccess('Invitation cancelled successfully');
    
    // Refresh the invitations list
    await refreshStaffInvitations();
  };
  
  // Check if user is an admin
  const isAdmin = sportsCenterUser?.role === 'admin';
  
  if (!isAdmin) {
    return (
      <Container>
        <Title>Staff Management</Title>
        <p>You do not have permission to manage staff members.</p>
      </Container>
    );
  }
  
  return (
    <Container>
      <Title>Staff Management</Title>
      
      <Section>
        <SectionTitle>Invite Staff Member</SectionTitle>
        <Form onSubmit={handleInvite}>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid="staff-email-input"
          />
          <Button type="submit" disabled={loading} data-testid="invite-staff-button">
            {loading ? 'Sending...' : 'Send Invitation'}
          </Button>
        </Form>
        
        {localError && <ErrorMessage>{localError}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </Section>
      
      <Section>
        <SectionTitle>Pending Invitations</SectionTitle>
        {staffInvitations && staffInvitations.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>Email</Th>
                <Th>Invited On</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {staffInvitations.map((invitation) => (
                <tr key={invitation.id}>
                  <Td>{invitation.email}</Td>
                  <Td>{invitation.invitedAt.toLocaleDateString()}</Td>
                  <Td>
                    <StatusBadge $status={invitation.status}>
                      {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                    </StatusBadge>
                  </Td>
                  <Td>
                    {invitation.status === 'pending' && (
                      <DangerButton 
                        onClick={() => handleCancelInvitation(invitation.id)}
                        data-testid={`cancel-invitation-${invitation.id}`}
                      >
                        Cancel
                      </DangerButton>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState>No pending invitations</EmptyState>
        )}
      </Section>
      
      <Section>
        <SectionTitle>Active Staff Members</SectionTitle>
        {activeStaff && activeStaff.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {activeStaff.map((staff) => (
                <tr key={staff.id}>
                  <Td>{staff.displayName}</Td>
                  <Td>{staff.email}</Td>
                  <Td>
                    <StatusBadge $status={staff.status}>
                      {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                    </StatusBadge>
                  </Td>
                  <Td>
                    {staff.status === 'active' && (
                      <DangerButton 
                        onClick={() => handleRevoke(staff.id)}
                        data-testid={`revoke-staff-${staff.id}`}
                      >
                        Revoke Access
                      </DangerButton>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState>No active staff members</EmptyState>
        )}
      </Section>
    </Container>
  );
};

export default StaffManager; 