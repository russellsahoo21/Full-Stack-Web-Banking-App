import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';
import { api } from '../api';

const RightPanel = () => {
  const [account, setAccount] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndAccount = async () => {
      try {
        const userProfile = await api.getMe();
        setProfile(userProfile);
        if (userProfile.accountId) {
          const accData = await api.getAccount(userProfile.accountId);
          setAccount(accData);
        }
      } catch (err) {
        if (err.status !== 401 && err.status !== 403 && !err.message?.includes('403') && !err.message?.includes('401')) {
          console.error('Error fetching account for right panel', err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndAccount();
  }, []);

  return (
    <aside className="right-panel">
      {/* Profile Section */}
      <div style={{ padding: '1.5rem', background: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
        <div style={{
          margin: '0 auto 1rem',
          width: '64px',
          height: '64px',
          borderRadius: 0,
          background: 'linear-gradient(135deg, var(--secondary-color), #4c1d95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'white',
          boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
          textTransform: 'uppercase'
        }}>
          {profile ? profile.username.charAt(0) : 'U'}
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', textTransform: 'capitalize' }}>
            {profile ? profile.username : 'Loading...'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {profile ? profile.email : 'Loading...'}
          </p>
        </div>
      </div>

      <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--surface-border)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Account ID</span>
          <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>
            {loading ? '...' : account ? `#${account.id}` : 'None'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status</span>
          <span style={{ fontWeight: '500', fontSize: '0.875rem', color: account && account.status === 'BLOCKED' ? 'var(--danger-color)' : 'inherit' }}>
            {loading ? '...' : account ? (account.status || 'Active') : 'N/A'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Joined</span>
          <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>
            {profile?.joinedDate ? new Date(profile.joinedDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '...'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '0.75rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Monthly Spend</p>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '10px' }}>₹1,240</div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Growth</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>+12%</div>
        </div>
      </div>

      {/* Credit Cards area */}
      <div style={{ position: 'relative', marginTop: '3rem', paddingRight: '1rem' }}>
        <div className="card-mockup" style={{ background: 'linear-gradient(135deg, #8b6d3f 0%, #5c4322 100%)', transform: 'rotate(4deg) translateX(4px)', transformOrigin: 'bottom right', position: 'absolute', top: 0, left: 0, right: '1rem', zIndex: 1, height: '180px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Russell Sahoo</span>
            <Wifi size={16} />
          </div>
        </div>
        <div className="card-mockup" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #050505 100%)', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '180px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Russell Sahoo</span>
            <Wifi size={16} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto', marginBottom: '1.5rem' }}>
            <div style={{ width: '36px', height: '24px', background: '#d4af37', borderRadius: '4px' }}></div>
            <span style={{ letterSpacing: '2px', fontSize: '1.1rem' }}>•••• ••••</span>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Russell Sahoo</span>
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
