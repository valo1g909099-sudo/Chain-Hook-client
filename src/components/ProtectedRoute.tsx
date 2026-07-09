import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-[#D4AF37] animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    
    return <Navigate to={`/login${location.search}`} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
