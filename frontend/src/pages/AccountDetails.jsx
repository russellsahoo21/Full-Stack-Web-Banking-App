import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useToast } from '../context/ToastContext';

const AccountDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [actionType, setActionType] = useState(null); // 'deposit', 'withdraw', 'transfer'
  const [amount, setAmount] = useState('');
  const [targetAccountId, setTargetAccountId] = useState('');
  const [pin, setPin] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // FD states
  const [fdCreating, setFdCreating] = useState(false);
  const [fdData, setFdData] = useState({ amount: '', duration: '6', category: 'GENERAL' });

  const loadData = async () => {
    try {
      setLoading(true);
      const [accData, txnData] = await Promise.all([
        api.getAccount(id),
        api.getTransactions(id).catch(() => []) // if it fails, fallback to empty
      ]);
      setAccount(accData);
      setTransactions(Array.isArray(txnData) ? txnData : []);
    } catch (err) {
      console.error('Error loading account details:', err);
      if (err.status === 401 || (err.message && err.message.includes('401'))) {
        navigate('/login');
      } else {
        setError(err.message || 'Failed to fetch account details');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAction = async (e) => {
    e.preventDefault();
    setPin('');
    setActionLoading(true);
    try {
      // Step 1: Verify PIN
      await api.verifyPin(pin);

      // Step 2: Perform Transaction
      const numAmount = parseFloat(amount);
      if (actionType === 'deposit') {
        await api.deposit(id, numAmount, pin);
      } else if (actionType === 'withdraw') {
        await api.withdraw(id, numAmount, pin);
      } else if (actionType === 'transfer') {
        await api.transfer({
          fromId: parseInt(id),
          toId: parseInt(targetAccountId),
          amount: numAmount,
          pin: pin
        });
      }
      showToast(`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} successful`, 'success');
      setActionType(null);
      setAmount('');
      setTargetAccountId('');
      setPin('');
      loadData();
    } catch (err) {
      showToast(err.message || `Failed to ${actionType}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateFD = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      // Step 1: Verify PIN
      await api.verifyPin(pin);

      // Step 2: Create FD
      await api.createFD({
        sourceAccountId: parseInt(id),
        amount: parseFloat(fdData.amount),
        durationInMonths: parseInt(fdData.duration),
        category: fdData.category,
        pin: pin
      });
      showToast('Fixed Deposit Created successfully!', 'success');
      setFdCreating(false);
      setFdData({ amount: '', duration: '6', category: 'GENERAL' });
      setPin('');
      loadData();
    } catch (err) {
      showToast(err.message || 'Error creating FD', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getInterestRate = (months, category) => {
    const m = parseInt(months) || 6;
    let rate = category === 'SENIOR_CITIZEN' ? 7.0 : 6.5;
    if (m >= 36) {
      rate += 0.5;
    }
    return rate.toFixed(1);
  };


  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)' }}>Loading account details...</div>;
  if (error) return <div style={{ color: 'var(--danger-color)', textAlign: 'center', marginTop: '3rem' }}>{error}</div>;
  if (!account) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Account not found.</div>;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/dashboard" style={{ color: 'var(--text-secondary)' }}>← Back to Dashboard</Link>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Account #{account.id}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Status: <span style={{ color: 'var(--primary-color)', background: 'rgba(0, 255, 157, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>{account.status || 'Active'}</span></p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Available Balance</p>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif' }}>
              ₹{(account.balance || 0).toFixed(2)}
            </div>
            {account.balance < 1000 && (
              <p style={{ color: 'var(--danger-color)', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '500' }}>
                Please maintain a minimum balance of ₹1,000
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => { setActionType('deposit'); setFdCreating(false); }}>Deposit</button>
          <button
            className="btn btn-secondary"
            onClick={() => { setActionType('withdraw'); setFdCreating(false); }}
            disabled={account.balance < 1000}
            style={account.balance < 1000 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            Withdraw
          </button>
          <button className="btn btn-secondary" onClick={() => { setActionType('transfer'); setFdCreating(false); }}>Transfer</button>
          <button className="btn btn-secondary" onClick={() => { setFdCreating(true); setActionType(null); }}>+ Fixed Deposit</button>
          <button
            className="btn btn-danger"
            style={{ marginLeft: 'auto', opacity: 0.5, cursor: 'not-allowed' }}
            onClick={() => showToast('To delete your account, please contact your nearest bank branch.', 'info')}
          >
            Delete Account
          </button>
        </div>
      </div>

      {actionType && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', animation: 'fadeIn 0.3s ease' }}>
          <h3 style={{ marginBottom: '1rem', textTransform: 'capitalize' }}>{actionType} Funds</h3>
          <form style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }} onSubmit={handleAction}>
            <div className="input-group" style={{ marginBottom: 0, flex: '1 1 200px' }}>
              <label className="input-label">Amount (₹)</label>
              <input type="number" required className="input-field" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
            </div>
            {actionType === 'transfer' && (
              <div className="input-group" style={{ marginBottom: 0, flex: '1 1 200px' }}>
                <label className="input-label">Target Account ID</label>
                <input type="number" required className="input-field" value={targetAccountId} onChange={e => setTargetAccountId(e.target.value)} />
              </div>
            )}
            <div className="input-group" style={{ marginBottom: 0, flex: '1 1 200px' }}>
              <label className="input-label">Transaction PIN</label>
              <input
                type="password"
                required
                className="input-field"
                value={pin}
                onChange={e => setPin(e.target.value)}
                maxLength="6"
                placeholder="4-6 digit PIN"
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flex: '1 1 100%' }}>
              <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                {actionLoading ? 'Processing...' : 'Confirm'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setActionType(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {fdCreating && (
        <div style={{
          background: 'var(--surface-color)',
          border: '1px solid var(--surface-border)',
          borderTop: '3px solid var(--primary-color)',
          padding: '2rem',
          marginBottom: '2rem',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.4rem' }}>Create Fixed Deposit</h3>
            <button type="button" onClick={() => setFdCreating(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.5rem', padding: '0 0.5rem' }}>✕</button>
          </div>

          <form onSubmit={handleCreateFD}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

              <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                <label className="input-label" style={{ color: 'var(--text-secondary)' }}>Category</label>
                <select
                  className="input-field"
                  value={fdData.category}
                  onChange={e => setFdData({ ...fdData, category: e.target.value })}
                >
                  <option value="GENERAL">General</option>
                  <option value="SENIOR_CITIZEN">Senior Citizen</option>
                </select>
              </div>

              <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                <label className="input-label" style={{ color: 'var(--text-secondary)' }}>Deposit Amount (₹)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontWeight: 'bold' }}>₹</span>
                  <input
                    type="number"
                    required
                    className="input-field"
                    style={{ paddingLeft: '2.5rem' }}
                    value={fdData.amount}
                    onChange={e => setFdData({ ...fdData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                  <label className="input-label" style={{ marginBottom: 0, color: 'var(--text-secondary)' }}>Duration: <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{fdData.duration} Months</span></label>
                  <span style={{ color: 'var(--primary-color)', fontWeight: 'bold', background: 'rgba(212, 175, 55, 0.1)', padding: '0.2rem 0.6rem', fontSize: '0.85rem' }}>
                    {getInterestRate(fdData.duration, fdData.category)}% p.a. Interest
                  </span>
                </div>
                <input
                  type="range"
                  required
                  style={{
                    width: '100%',
                    cursor: 'pointer',
                    accentColor: 'var(--primary-color)'
                  }}
                  value={fdData.duration}
                  onChange={e => setFdData({ ...fdData, duration: e.target.value })}
                  min="6"
                  max="60"
                  step="1"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>6 M</span>
                  <span>60 M</span>
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label" style={{ color: 'var(--text-secondary)' }}>Transaction PIN</label>
                <input
                  type="password"
                  required
                  className="input-field"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  maxLength="6"
                  placeholder="4-6 digit Secure PIN"
                />
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--surface-border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" style={{ padding: '0.75rem 2rem' }} onClick={() => setFdCreating(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }} disabled={actionLoading}>
                {actionLoading ? 'Processing...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      <h2>Transaction History</h2>
      {transactions.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No transactions found for this account.</p>
        </div>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          {transactions.slice().reverse().map((txn, idx) => {
            const isCredit = txn.type === 'DEPOSIT' || txn.type === 'CREDIT' || (txn.type === 'TRANSFER' && String(txn.targetAccountId) === String(id));
            const sign = isCredit ? '+' : '-';

            return (
              <div key={idx} className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem', textTransform: 'capitalize' }}>
                    {txn.type === 'TRANSFER' ? `Transfer ${isCredit ? 'from' : 'to'} #${isCredit ? txn.sourceAccountId : txn.targetAccountId}` : (txn.type || 'Transaction')}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {new Date(txn.timestamp || Date.now()).toLocaleString()}
                  </p>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: isCredit ? 'var(--success-color)' : 'var(--danger-color)' }}>
                  {sign}₹{(txn.amount || 0).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AccountDetails;
