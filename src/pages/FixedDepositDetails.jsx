import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useToast } from '../context/ToastContext';
import { Landmark, ArrowLeft, TrendingUp, Calendar, ShieldCheck, Wallet } from 'lucide-react';

const FixedDepositDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [fd, setFd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const fdData = await api.getFDDetails(id);
      setFd(fdData);
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('403')) {
        navigate('/login');
      } else {
        setError(err.message || 'Failed to fetch fixed deposit details');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
      <div style={{ textAlign: 'center' }}>
        <p>Loading deposit details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem' }}>
      <ShieldCheck color="var(--danger-color)" size={48} style={{ marginBottom: '1rem' }} />
      <h2 style={{ color: 'var(--danger-color)' }}>Oops! Something went wrong</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>{error}</p>
      <Link to="/fixed-deposits" className="btn btn-secondary">
        <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Fixed Deposits
      </Link>
    </div>
  );

  if (!fd) return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Fixed Deposit Not Found</h2>
      <Link to="/fixed-deposits" className="btn btn-secondary">
        <ArrowLeft size={16} /> Back to Fixed Deposits
      </Link>
    </div>
  );

  // Interest calculation (in case backend doesn't provide it)
  const principal = fd.amount || 0;
  const rate = fd.interestRate || 6.0;
  const duration = fd.durationInMonths || 6;
  const interestEarned = principal * (rate / 100) * (duration / 12);
  const maturityAmount = principal + interestEarned;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/fixed-deposits" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Back to Fixed Deposits
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem', borderTop: '4px solid var(--primary-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Landmark color="var(--primary-color)" size={24} />
              <h2 style={{ fontSize: '2rem', margin: 0 }}>Fixed Deposit #{fd.id}</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Status: <span style={{ color: 'var(--primary-color)', background: 'rgba(212, 175, 55, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem' }}>{fd.status || 'ACTIVE'}</span>
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Investment Principal</p>
            <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
              ₹{principal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h1>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '3rem', borderTop: '1px solid var(--surface-border)', paddingTop: '2.5rem' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={16} /> Interest Rate
            </p>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{rate}% <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>p.a.</span></h3>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} /> Term Duration
            </p>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{duration} <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>Months</span></h3>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderLeft: '4px solid var(--primary-color)' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Interest Earned</p>
            <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--primary-color)' }}>+₹{interestEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wallet size={16} /> Maturity Value
            </p>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              ₹{maturityAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Maturity Schedule</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Opening Date</span>
                <span>{fd.createdAt ? new Date(fd.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Maturity Date</span>
                <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{fd.maturityDate ? new Date(fd.maturityDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--surface-border)', paddingTop: '1.25rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Payout Frequency</span>
                <span>At Maturity</span>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Associated Account</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Funds will be credited back to this account upon maturity.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--surface-border)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              #
            </div>
            <div>
              <p style={{ fontWeight: 600, margin: 0 }}>Account #{fd.sourceAccountId || 'N/A'}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Linked Funding Source</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FixedDepositDetails;
