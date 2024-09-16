import React from "react";
import { NavLink as RouterLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

// Navbar container with responsive styles
const NavbarContainer = styled.div`
  background-color: #6a0d91; // Royal Purple
  padding: 1rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 1rem 0;
  }
`;

// Styled component for navigation links
const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    text-align: center;
  }
`;

// Custom link styling for both normal and active states
const NavLink = styled(RouterLink)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  display: block;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;

  // Hover effect
  &:hover {
    background-color: rgba(
      255,
      255,
      255,
      0.2
    ); // Slight background color on hover
  }

  // Active state styles (when the route matches)
  &.active {
    background-color: #ff6f61; // Coral for active state
    color: white;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

// Styled component for the logout button
const LogoutButton = styled.button`
  background-color: #ff6f61; // Coral
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff3f3f; // Darker Coral
  }

  @media (max-width: 768px) {
    margin-top: 0.5rem;
  }
`;

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  // Function to handle logout
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:4500/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Remove token from localStorage
      localStorage.removeItem("token");
      // Redirect to login page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <NavbarContainer>
      <NavLinks>
        <NavLink to="/dashboard" activeclassname="active">
          Dashboard
        </NavLink>
        <NavLink to="/task-form" activeclassname="active">
          Tasks
        </NavLink>
        <NavLink to="/ai-suggestion" activeclassname="active">
          AI Suggestions
        </NavLink>
      </NavLinks>
      <LogoutButton onClick={logout}>Logout</LogoutButton>
    </NavbarContainer>
  );
};

export default Navbar;
