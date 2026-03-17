import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

const AdminRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if role is admin (handles both PascalCase and camelCase)
  const role = user?.Role || user?.role;
  if (!role || role.toLowerCase() !== "admin") {
    // If authenticated but not admin, redirect to home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;