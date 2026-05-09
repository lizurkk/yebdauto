import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { loadRemoteStore } from './services/store';
import LandingPage from './views/LandingPage';
import DashboardLayout from './views/dashboard/DashboardLayout';
import Overview from './views/dashboard/Overview';
import StudentsList from './views/dashboard/StudentsList';
import InstructorsList from './views/dashboard/InstructorsList';
import VehiclesList from './views/dashboard/VehiclesList';
import LeadsList from './views/dashboard/LeadsList';
import FinanceTracker from './views/dashboard/FinanceTracker';
import Planning from './views/dashboard/Planning';
import CatalogueManager from './views/dashboard/CatalogueManager';
import Login from './views/Login';
import PricingView from './views/public/PricingView';
import ProcedureView from './views/public/ProcedureView';
import ContactView from './views/public/ContactView';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = loading
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const location = useLocation();

  // ── Firebase Auth listener — persists login across page refresh ──
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadRemoteStore().catch((error) => {
      console.error('Failed to initialize Firebase-backed store:', error);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogin = (status: boolean) => {
    setIsAuthenticated(status);
  };

  const handleLogout = async () => {
    await auth.signOut();
    setIsAuthenticated(false);
  };

  // Show nothing while Firebase checks auth state (avoids flash to login)
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#222831] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00ADB5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-50 selection:bg-brand/30 transition-colors duration-300">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/formations" element={<PricingView theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/tarifs" element={<Navigate to="/formations" replace />} />
        <Route path="/procedure" element={<ProcedureView theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/contact" element={<ContactView theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated
              ? <DashboardLayout theme={theme} onToggleTheme={toggleTheme} onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Overview />} />
          <Route path="students" element={<StudentsList />} />
          <Route path="instructors" element={<InstructorsList />} />
          <Route path="leads" element={<LeadsList />} />
          <Route path="vehicles" element={<VehiclesList />} />
          <Route path="catalogue" element={<CatalogueManager />} />
          <Route path="planning" element={<Planning />} />
          <Route path="finance" element={<FinanceTracker />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
