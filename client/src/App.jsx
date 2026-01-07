import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Settings/Settings';
import Transactions from './pages/Dashboard/Transactions';
import Products from './pages/Dashboard/Products';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
};


function App() {
  return (
    <>
      <div className="mobile-blocker">
        <div className="glass card" style={{ textAlign: 'center', maxWidth: '300px', padding: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(0deg)', color: 'var(--primary)' }}>
              <rect width="18" height="12" x="3" y="6" rx="2" />
              <path d="M12 18v4" />
              <path d="M8 22h8" />
            </svg>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Billing Management System works best on desktop or in landscape mode.</p>
        </div>

      </div>
      <Router>
        <AuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition={Bounce}
          />
          <div className="app-main">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/transactions" element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              } />
              <Route path="/products" element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
