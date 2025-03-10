import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const ProfileContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const Avatar = styled.div<{ photoURL?: string | null }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: #0072ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background-image: ${props => props.photoURL ? `url(${props.photoURL})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 200px;
  z-index: 100;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const UserInfo = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const UserName = styled.p`
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserEmail = styled.p`
  color: #718096;
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DropdownItem = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: #4a5568;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f7fafc;
  }
  
  &:last-child {
    color: #e53e3e;
  }
`;

const UserProfile: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  const getInitials = () => {
    if (!currentUser || !currentUser.displayName) return '?';
    
    return currentUser.displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-profile-container]')) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);
  
  return (
    <ProfileContainer data-profile-container data-testid="user-profile">
      <ProfileButton 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
        data-testid="profile-button"
      >
        {currentUser?.photoURL ? (
          <Avatar 
            photoURL={currentUser.photoURL} 
            data-testid="user-avatar-photo"
            aria-label="User avatar with photo" 
          />
        ) : (
          <Avatar 
            data-testid="user-avatar-initials"
            aria-label="User avatar with initials"
          >
            {getInitials()}
          </Avatar>
        )}
      </ProfileButton>
      
      {isOpen && (
        <Dropdown data-testid="profile-dropdown">
          <UserInfo>
            <UserName>{currentUser?.displayName || 'User'}</UserName>
            <UserEmail>{currentUser?.email}</UserEmail>
          </UserInfo>
          
          <DropdownItem 
            onClick={() => {
              // Handle profile navigation
              setIsOpen(false);
            }}
            data-testid="profile-link"
          >
            My Profile
          </DropdownItem>
          
          <DropdownItem 
            onClick={() => {
              // Handle settings navigation
              setIsOpen(false);
            }}
            data-testid="settings-link"
          >
            Settings
          </DropdownItem>
          
          <DropdownItem 
            onClick={handleLogout}
            data-testid="logout-button"
          >
            Log Out
          </DropdownItem>
        </Dropdown>
      )}
    </ProfileContainer>
  );
};

export default UserProfile; 