import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useToast } from '../context/ToastContext';

const Accounts = () => {
  const { showToast } = useToast();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const accountsData = await api.getAccounts();
      const accountsList = Array.isArray(accountsData) ? accountsData : (accountsData ? [accountsData] : []);
      
      // Sort accounts by ID ascending
      accountsList.sort((a, b) => Number(a.id) - Number(b.id));
      setAccounts(accountsList);
    } catch (err) {
      if (err.status === 401 || err.status === 403 || (err.message && (err.message.includes('401') || err.message.includes('403')))) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.message || 'Failed to fetch accounts');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [navigate]);

  const handleCreateAccount = async () => {
    try {
      setCreating(true);
      await api.createAccount();
      loadAccounts(); // reload accounts list
    } catch (err) {
      showToast(err.message || 'Error creating account', 'error');
    } finally {
      setCreating(false);
    }
  };

  const totalBalance = accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  return (
    <div>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem', fontFamily: 'Outfit' }}>
            <span style={{ color: 'var(--text-primary)' }}>Your Accounts</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your active bank accounts</p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem', fontSize: '1rem' }}>
            Total Combined Balance
          </p>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Outfit', color: 'var(--primary-color)' }}>
            ₹{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>Active Accounts ({accounts.length})</h2>
        <button className="btn btn-primary" onClick={handleCreateAccount} disabled={creating} style={{ borderRadius: 0, padding: '0.75rem 2rem' }}>
          {creating ? 'Creating...' : '+ Open New Account'}
        </button>
      </div>

      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderLeft: '3px solid var(--danger-color)' }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading accounts...</p>
        </div>
      ) : accounts.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <span style={{ color: 'var(--primary-color)', fontSize: '2rem' }}>💰</span>
          </div>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>No accounts found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You don't have any active accounts linked to your profile.</p>
          <button className="btn btn-primary" onClick={handleCreateAccount} disabled={creating} style={{ borderRadius: 0 }}>
            {creating ? 'Creating...' : '+ Open New Account'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {accounts.map(account => (
            <Link to={`/account/${account.id}`} key={account.id} className="glass-panel" style={{ padding: '2rem', display: 'block', transition: 'all 0.2s ease', textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--primary-color)' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-primary)' }}>Account #{account.id}</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Full Access</div>
                </div>
                <span style={{ fontSize: '0.85rem', background: 'rgba(0, 255, 157, 0.1)', color: 'var(--primary-color)', padding: '0.3rem 0.8rem', fontWeight: 'bold', borderRadius: 0 }}>
                  {account.status || 'Active'}
                </span>
              </div>
              
              <div style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Available Balance</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                  ₹{(account.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span>Manage actions & transfers</span>
                <span style={{ color: 'var(--primary-color)' }}>View details →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Accounts;
