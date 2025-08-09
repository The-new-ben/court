import React, { useState, useEffect } from 'react';
import AuthContainer from './components/AuthContainer';
import MainApp from './components/MainApp';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

function AppContent() {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">{t('app.loading')}</div>
      </div>
    );
  }

  return user ? <MainApp /> : <AuthContainer />;
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;