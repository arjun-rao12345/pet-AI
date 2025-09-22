import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPaw, FaUser, FaSignOutAlt, FaHome, FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const NavbarContainer = styled.nav`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  
  &:hover {
    color: #f8f9fa;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const UserInfo = styled.span`
  color: white;
  margin-right: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <NavbarContainer>
      <NavContent>
        <Logo to="/">
          <FaPaw />
          PetHealth Care
        </Logo>
        
        <NavLinks>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard">
                <FaHome />
                Dashboard
              </NavLink>
              <NavLink to="/add-pet">
                <FaPlus />
                Add Pet
              </NavLink>
              <UserInfo>
                <FaUser />
                {user?.name}
              </UserInfo>
              <LogoutButton onClick={handleLogout}>
                <FaSignOutAlt />
                Logout
              </LogoutButton>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </NavLinks>
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar;
