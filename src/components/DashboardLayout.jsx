import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import { api } from '../api';
import { AlertCircle, ChevronRight, X, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const DashboardLayout = () => {
  const [isPinSet, setIsPinSet] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const location = useLocation();

  const checkPinStatus = async () => {
    try {
      const pinStatus = await api.getPinStatus();
      // Assume the backend returns a field like 'isPinSet' (or just a boolean)
      setIsPinSet(!!(pinStatus.isPinSet || pinStatus.status === 'SET' || pinStatus === true));
    } catch (err) {
      console.error('Failed to check PIN status:', err);
    }
  };

  useEffect(() => {
    checkPinStatus();
  }, [location.pathname]);

  const handleSetPin = async (e) => {
    e.preventDefault();
    if (pinValue.length < 4) {
      showToast('PIN must be at least 4 digits', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.setPin(pinValue);
      showToast('Transaction PIN set successfully!', 'success');
      setIsPinSet(true);
      setShowPinModal(false);
      setPinValue('');
    } catch (err) {
      showToast(err.message || 'Failed to set PIN', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout animate-fade-in">
      <Sidebar />
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>

        {/* Bottom-right Notification */}
        {!isPinSet && !showPinModal && (
          <div 
            onClick={() => setShowPinModal(true)}
            style={{ 
              position: 'fixed',
              bottom: '2rem',
              right: '25rem', // Offset for the right panel
              background: 'linear-gradient(135deg, var(--primary-color) 0%, #b8860b 100%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
              zIndex: 900,
              cursor: 'pointer',
              animation: 'slideInRight 0.5s ease',
              maxWidth: '300px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.4)';
            }}
          >
            <div style={{ 
              background: 'black', 
              borderRadius: '50%', 
              width: '32px', 
              height: '32px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={18} color="var(--primary-color)" />
            </div>
            <div>
              <div style={{ color: 'black', fontWeight: 'bold', fontSize: '0.9rem' }}>PIN Not Set</div>
              <div style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '0.75rem', fontWeight: '500' }}>Setup your transaction PIN now.</div>
            </div>
          </div>
        )}

        {showPinModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(8px)'
          }}>
            <div className="glass-panel" style={{ width: '400px', padding: '2rem', position: 'relative', border: '1px solid var(--primary-color)' }}>
              <button 
                onClick={() => setShowPinModal(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
              
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ 
                  background: 'rgba(212, 175, 55, 0.1)', 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <ShieldCheck size={32} color="var(--primary-color)" />
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Set Transaction PIN</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>This PIN will be required for all your financial activities.</p>
              </div>

              <form onSubmit={handleSetPin}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enter 4-6 Digit PIN</label>
                  <input 
                    type="password" 
                    required 
                    autoFocus
                    maxLength="6"
                    className="form-control"
                    placeholder="••••••"
                    value={pinValue}
                    onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ''))}
                    style={{ 
                      width: '100%', 
                      textAlign: 'center', 
                      fontSize: '2rem', 
                      letterSpacing: '0.5rem',
                      background: 'rgba(212, 175, 55, 0.05)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: 'var(--text-primary)',
                      borderRadius: '12px',
                      padding: '1rem'
                    }}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading}
                  style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 'bold' }}
                >
                  {loading ? 'Setting PIN...' : 'Secure My Account'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
      <RightPanel />
    </div>
  );
};

export default DashboardLayout;
