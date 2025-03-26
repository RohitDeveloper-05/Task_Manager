// frontend/src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // Avoid showing a spinner; wait silently
  }

  return isAuthenticated ? children : <Navigate to='/login' replace />;
};

export default PrivateRoute;
