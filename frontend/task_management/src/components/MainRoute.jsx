import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import Taskform from "../pages/Taskform";
import AISuggestions from "../pages/AISuggestions";
import Navbar from "./Navbar";

const isAuthenticated = () => !!localStorage.getItem("token");

const MainRoute = () => {
  return (
    <>
      {/* Only show Navbar if authenticated */}
      {isAuthenticated() && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? <Navigate to="/dashboard" /> : <LoginPage />
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/task-form"
          element={isAuthenticated() ? <Taskform /> : <Navigate to="/" />}
        />
        <Route
          path="/task-form/:id"
          element={isAuthenticated() ? <Taskform /> : <Navigate to="/" />}
        />
        <Route
          path="/ai-suggestion"
          element={isAuthenticated() ? <AISuggestions /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
};

export default MainRoute;
