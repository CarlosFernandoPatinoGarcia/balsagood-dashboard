import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/AuthService';

const PrivateRoute = () => {
    const user = authService.getCurrentUser();
    // If user exists, render Child routes (Dashboard, etc.)
    // If not, redirect to Login
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;