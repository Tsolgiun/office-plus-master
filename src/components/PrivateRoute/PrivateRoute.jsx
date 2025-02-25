import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // 如果用户未认证则重定向到登录页面
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
