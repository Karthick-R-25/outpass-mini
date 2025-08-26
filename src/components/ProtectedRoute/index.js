import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookie from "js-cookie";

const ProtectedRoute = ({ username, user }) => {
  const token = Cookie.get("jwt_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Pass props to children rendered by <Outlet />
  return <Outlet context={{ username, user }} />;
};

export default ProtectedRoute;
