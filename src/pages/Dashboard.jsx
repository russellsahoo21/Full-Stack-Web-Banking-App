import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useToast } from '../context/ToastContext';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#d4af37', '#b8860b', '#cd853f', '#a0522d', '#8b4513'];

const Dashboard = () => {
  const { showToast } = useToast();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const userProfile = await api.getMe();
      setProfile(userProfile);

      try {
        const accountsData = await api.getAccounts();
        const accountsList = Array.isArray(accountsData) ? accountsData : (accountsData ? [accountsData] : []);
        
        // Sort accounts by ID ascending to ensure older accounts appear first
        accountsList.sort((a, b) => Number(a.id) - Number(b.id));
        
        setAccounts(accountsList);

        if (accountsList.length > 0) {
          setLoadingTransactions(true);
          try {
            const allTxnsPromises = accountsList.map(acc => api.getTransactions(acc.id).catch(() => []));
            const allTxnsResults = await Promise.all(allTxnsPromises);
            
            let flatTransactions = [];
            allTxnsResults.forEach((txList, idx) => {
              const accId = accountsList[idx].id;
              const tagged = txList.map(tx => ({ ...tx, contextAccountId: accId }));
              flatTransactions.push(...tagged);
            });

            flatTransactions.sort((a, b) => {
              const dateA = new Date(a.timestamp || a.createdAt || 0);
              const dateB = new Date(b.timestamp || b.createdAt || 0);
              return dateB - dateA;
            });
            setTransactions(flatTransactions.slice(0, 8)); // Show a few more
          } catch (tErr) {
            console.error('Error fetching transactions', tErr);
          } finally {
            setLoadingTransactions(false);
          }
        } else {
          setAccounts([]);
          setTransactions([]);
        }
      } catch (accErr) {
        console.error('Error fetching accounts', accErr);
        setAccounts([]);
      }
    } catch (err) {
      if (err.status === 401 || err.status === 403 || err.message.includes('401') || err.message.includes('403') || err.message.toLowerCase().includes('forbidden') || err.message.toLowerCase().includes('unauthorized')) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.message || 'Failed to fetch dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

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
  const chartData = accounts.length > 0 
    ? accounts.map((acc, index) => ({ name: `Acc #${acc.id}`, value: acc.balance || 10, color: COLORS[index % COLORS.length] }))
    : [{ name: 'Empty', value: 100, color: 'var(--surface-color)' }];

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', fontFamily: 'Outfit' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Welcome, </span>
          <span style={{ textTransform: 'capitalize' }}>{profile?.username || 'User'}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Experience the next level of Net-banking</p>
      </div>

      <div className="donut-container">
        <div style={{ width: '200px', height: '200px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
            Bank Accounts: {accounts.length}
          </div>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem', fontSize: '1.1rem' }}>
            Total Current Balance:
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Outfit' }}>
            ₹{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>Your Accounts</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleCreateAccount} disabled={creating} style={{ borderRadius: 0, flex: 1, whiteSpace: 'nowrap' }}>
            {creating ? 'Creating...' : '+ New Account'}
          </button>
        </div>
      </div>

      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}



      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading accounts...</p>
        </div>
      ) : accounts.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>You don't have any accounts yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {accounts.map(account => (
            <Link to={`/account/${account.id}`} key={account.id} className="glass-panel" style={{ padding: '1.5rem', display: 'block', transition: 'transform 0.2s, box-shadow 0.2s', textDecoration: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Account #{account.id}</h3>
                <span style={{ fontSize: '0.8rem', background: 'rgba(0, 255, 157, 0.1)', color: 'var(--primary-color)', padding: '0.2rem 0.6rem', borderRadius: 0 }}>
                  {account.status || 'Active'}
                </span>
              </div>
              <div style={{ marginTop: '1.5rem', fontSize: '2rem', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif' }}>
                ₹{(account.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                View details & transactions →
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Recent Transactions Section */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Recent Transactions</h2>
        {loadingTransactions ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No recent transactions found.</p>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '0' }}>
            {(() => {
              const userAccountIds = accounts.map(acc => String(acc.id));
              return transactions.map((tx, idx) => {
                // Define if it's a credit for the specific account entry shown
                // Since these are also flat-mapped, we check if the entry belongs to the target account
                let isCredit = tx.type === 'DEPOSIT' || tx.type === 'CREDIT' || tx.type === 'LOAN_DISBURSEMENT' || tx.type === 'DISBURSEMENT';
                
                if (tx.type === 'TRANSFER') {
                  if (userAccountIds.includes(String(tx.targetAccountId)) && !userAccountIds.includes(String(tx.sourceAccountId))) {
                    // Incoming from outside
                    isCredit = true;
                  } else if (userAccountIds.includes(String(tx.sourceAccountId)) && userAccountIds.includes(String(tx.targetAccountId))) {
                    // (In dashboard we just have the flat list, so we check which account ID is attached to this txn object)
                    isCredit = String(tx.contextAccountId) === String(tx.targetAccountId);
                  } else {
                    // Outgoing
                    isCredit = false;
                  }
                }

                const sign = isCredit ? '+' : '-';
                const color = isCredit ? 'var(--success-color)' : 'var(--danger-color)';
                
                let txTitle = tx.type ? tx.type.toLowerCase() : 'transaction';
                if (tx.type === 'TRANSFER') {
                  txTitle = `Transfer ${isCredit ? 'from' : 'to'} #${isCredit ? tx.sourceAccountId : tx.targetAccountId}`;
                } else {
                  txTitle = `${txTitle} - Account #${tx.accountId || tx.account?.id || 'Unknown'}`;
                }

                return (
                  <div key={`txn-${tx.id || tx.transactionId}-${idx}`} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    padding: '1.5rem', borderBottom: idx < transactions.length - 1 ? '1px solid var(--surface-border)' : 'none'
                  }}>
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '0.25rem', textTransform: 'capitalize' }}>
                        {txTitle}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {tx.timestamp || tx.createdAt ? new Date(tx.timestamp || tx.createdAt).toLocaleString() : 'Recent'}
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color }}>
                      {sign}₹{Math.abs(tx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
