import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    // For UI development phase, authentication is mocked. 
    // We assume the user is authenticated to view protected routes.
    // In a real application, this would verify a token or global Auth Context.
    const isAuthenticated = true;

    if (!isAuthenticated) {
        return <Navigate to="/user/login" replace />;
    }

    return <Outlet />;
}
