import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthRoutes = ({ children }) => {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = localStorage.getItem("accessToken");

  const isProtectedRoute =
    !["/", "/register"].includes(location.pathname) &&
    !location.pathname.startsWith("/du-an");
  if (accessToken && userInfo?.email && userInfo?.name && isProtectedRoute) {
    return <Navigate to="/admin/tao-du-an" />;
  }

  return children;
};

export default AuthRoutes;
