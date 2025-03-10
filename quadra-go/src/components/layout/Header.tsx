import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const HeaderContainer = styled.header`
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  margin-left: 20px;
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ProfilePicture = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color);
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-left: 20px;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">QuadraGo</Logo>
        <Nav>
          {isAuthenticated ? (
            <ProfileContainer>
              {user?.profilePicture && (
                <ProfilePicture src={user.profilePicture} alt={user.name} />
              )}
              <span>Welcome, {user?.name}</span>
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </ProfileContainer>
          ) : (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/#login">Login</NavLink>
              <NavLink to="/#signup">Sign Up</NavLink>
            </>
          )}
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 