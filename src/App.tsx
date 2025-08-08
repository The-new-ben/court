import React, { useState, useEffect } from 'react';
import AuthContainer from './components/AuthContainer';
import MainApp from './components/MainApp';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">טוען...</div>
      </div>
    );
  }

  return user ? <MainApp /> : <AuthContainer />;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;