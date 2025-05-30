import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import SidebarLayout from './components/SidebarLayout';
import { useTheme } from './hooks/useTheme';
import './i18n';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Datasets = lazy(() => import('./pages/Datasets'));
const Models = lazy(() => import('./pages/Models'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = () => <div className="text-gray-600 text-xl">404 - Page Not Found</div>;

const queryClient = new QueryClient();

function App() {
  // Initialize theme
  useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Global toaster available outside layout */}
      <Toaster richColors position="top-right" />

      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
        <SidebarLayout>
          <Suspense fallback={<div className="text-muted-foreground text-center mt-20">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/datasets" element={<Datasets />} />
              <Route path="/models" element={<Models />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </SidebarLayout>
      </div>
    </QueryClientProvider>
  );
}

export default App;