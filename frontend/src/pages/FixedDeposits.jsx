import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useToast } from '../context/ToastContext';
import { Landmark, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

const FixedDeposits = () => {
  const { showToast } = useToast();
  const [fds, setFds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadFDs = async () => {
    try {
      setLoading(true);
      const fdData = await api.getMyFDs();
      setFds(Array.isArray(fdData) ? fdData : (fdData ? [fdData] : []));
    } catch (err) {
      console.error('Error loading FDs:', err);
      if (err.status === 401 || (err.message && err.message.includes('401'))) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.message || 'Failed to fetch fixed deposits');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFDs();
  }, [navigate]);

  const totalInvestment = fds.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem', fontFamily: 'Outfit' }}>
            <span style={{ color: 'var(--text-primary)' }}>Fixed Deposits</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>High-yield savings with guaranteed returns</p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem', fontSize: '1rem' }}>
            Total Principal Invested
          </p>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Outfit', color: 'var(--primary-color)' }}>
            ₹{totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>Active Deposits ({fds.length})</h2>
        <Link to="/accounts" className="btn btn-primary" style={{ borderRadius: 0, padding: '0.75rem 2rem' }}>
          + Create New FD
        </Link>
      </div>

      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderLeft: '3px solid var(--danger-color)' }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading fixed deposits...</p>
        </div>
      ) : fds.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Landmark color="var(--primary-color)" size={32} />
          </div>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>No fixed deposits found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Start growing your wealth with fixed returns.</p>
          <Link to="/accounts" className="btn btn-primary" style={{ borderRadius: 0 }}>
            Open Fixed Deposit
          </Link>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '0', borderRadius: '12px', overflow: 'hidden' }}>
          {fds.map((fd, idx) => (
            <Link 
              to={`/fixed-deposit/${fd.id}`} 
              key={fd.id} 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1.2fr', 
                alignItems: 'center', 
                padding: '1.5rem 2rem', 
                borderBottom: idx < fds.length - 1 ? '1px solid var(--surface-border)' : 'none',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
              }}
              className="fd-list-item"
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Landmark size={20} color="var(--primary-color)" />
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>FD #{fd.id}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Created: {fd.createdAt ? new Date(fd.createdAt).toLocaleDateString() : 'Recent'}</div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Principal</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  ₹{(fd.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Returns</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <TrendingUp size={16} />
                  {fd.interestRate || 6.0}% <span style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>p.a.</span>
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Term</div>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={16} />
                  {fd.durationInMonths || 6} Mo.
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', background: 'rgba(0, 255, 157, 0.1)', color: 'var(--primary-color)', padding: '0.25rem 0.5rem', fontWeight: 'bold', borderRadius: '4px', verticalAlign: 'middle', marginRight: '1rem' }}>
                  {fd.status || 'ACTIVE'}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                   Details <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FixedDeposits;
