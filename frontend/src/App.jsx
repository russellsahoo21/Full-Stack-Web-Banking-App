import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AccountDetails from './pages/AccountDetails';
import Accounts from './pages/Accounts';
import Settings from './pages/Settings';
import Transactions from './pages/Transactions';
import FixedDeposits from './pages/FixedDeposits';
import FixedDepositDetails from './pages/FixedDepositDetails';
import Loans from './pages/Loans';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const RootRoute = () => {
  const token = localStorage.getItem('token');
  if (token) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
};

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
        {/* Public Routes with original container styling */}
        <Route path="/login" element={<div className="app-container"><Navbar /><main className="container animate-fade-in"><Login /></main></div>} />
        <Route path="/register" element={<div className="app-container"><Navbar /><main className="container animate-fade-in"><Register /></main></div>} />
        
        {/* Protected layout with Sidebar and RightPanel */}
        <Route 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/account/:id" element={<AccountDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/fixed-deposits" element={<FixedDeposits />} />
          <Route path="/fixed-deposit/:id" element={<FixedDepositDetails />} />
          <Route path="/loans" element={<Loans />} />
        </Route>

        <Route path="/" element={<RootRoute />} />
        <Route path="*" element={<RootRoute />} />
      </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
