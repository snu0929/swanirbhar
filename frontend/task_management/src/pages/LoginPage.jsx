import React, { useState } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import Login from "../components/Login";
import Signup from "../components/Signup";
import TaskManagerLogo from "../assets/—Pngtree—efficient task management the checklist_15918016.png"; // Import the logo

// Global style to remove default margin and padding
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body, html {
    height: 100%;
    font-family: 'Arial', sans-serif;
  }
`;

// Background animation for the text at the top
const fadeInTop = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Background animation for the logo and form container
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Overall container
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  animation: ${fadeIn} 1s ease-in-out;
`;

// Header text section with animation
const HeaderText = styled.div`
  padding: 2rem;
  background-color: #ff6f61;
  text-align: center;
  animation: ${fadeInTop} 1s ease-in-out;
  color: white;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.3rem;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    h1 {
      font-size: 2rem;
    }
    p {
      font-size: 1.1rem;
    }
  }

  @media (max-width: 480px) {
    padding: 1rem;
    h1 {
      font-size: 1.8rem;
    }
    p {
      font-size: 1rem;
    }
  }
`;

// Wrapper to contain the left and right content (logo and form)
const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Left side for the logo
const LeftSide = styled.div`
  flex: 1;
  background-color: #ff6f61;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
    flex: 0.6; /* Adjust logo height in smaller screens */
  }
`;

// Right side for the form
const RightSide = styled.div`
  flex: 1;
  background-color: #ff6f61;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
    flex: 1.4; /* Adjust form height in smaller screens */
  }
`;

// Logo styling
const Logo = styled.img`
  max-width: 90%;
  height: auto;
  object-fit: contain;

  @media (max-width: 480px) {
    max-width: 80%;
  }
`;

// Auth container (login/signup form area)
const AuthContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 450px;
  width: 100%;
  text-align: center;

  h2 {
    margin-bottom: 1.5rem;
    color: #6a0d91;
  }

  @media (max-width: 768px) {
    max-width: 400px;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    max-width: 90%;
    padding: 1rem;
  }
`;

// Toggle link
const ToggleLink = styled.button`
  background: none;
  border: none;
  color: #ff6f61;
  cursor: pointer;
  margin-top: 1rem;
  font-size: 1rem;
  transition: color 0.3s ease;
  font-weight: bold;

  &:hover {
    color: #ff3f3f;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

// LoginPage Component
const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  // Toggle between Login and Signup
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        {/* Header text section */}
        <HeaderText>
          <h1>Welcome to TaskManager Pro</h1>
          <p>
            Manage your tasks effortlessly with AI-powered suggestions.
            Prioritize and streamline your workflow in just a few clicks!
          </p>
        </HeaderText>

        {/* Main content section (logo and form) */}
        <ContentContainer>
          {/* Left side with the logo */}
          <LeftSide>
            <Logo src={TaskManagerLogo} alt="Task Manager Logo" />
          </LeftSide>

          {/* Right side with login/signup form */}
          <RightSide>
            <AuthContainer>
              {isLogin ? (
                <>
                  <Login switchToSignup={toggleAuthMode} />
                  <p>
                    Don't have an account?{" "}
                    <ToggleLink onClick={toggleAuthMode}>Sign Up</ToggleLink>
                  </p>
                </>
              ) : (
                <>
                  <Signup switchToLogin={toggleAuthMode} />
                  <p>
                    Already have an account?{" "}
                    <ToggleLink onClick={toggleAuthMode}>Log In</ToggleLink>
                  </p>
                </>
              )}
            </AuthContainer>
          </RightSide>
        </ContentContainer>
      </PageContainer>
    </>
  );
};

export default LoginPage;
