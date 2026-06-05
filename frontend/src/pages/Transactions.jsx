import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterAccount, setFilterAccount] = useState('ALL');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const accountsData = await api.getAccounts();
        const accountsList = Array.isArray(accountsData) ? accountsData : (accountsData ? [accountsData] : []);
        setAccounts(accountsList);

        if (accountsList.length > 0) {
          const allTxnsPromises = accountsList.map(acc => api.getTransactions(acc.id).catch(() => []));
          const allTxnsResults = await Promise.all(allTxnsPromises);
          
          let flatTransactions = allTxnsResults.flat();
          flatTransactions.sort((a, b) => {
            const dateA = new Date(a.timestamp || a.createdAt || 0);
            const dateB = new Date(b.timestamp || b.createdAt || 0);
            return dateB - dateA;
          });
          setTransactions(flatTransactions);
        } else {
          setTransactions([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = filterAccount === 'ALL' 
    ? transactions 
    : transactions.filter(tx => 
        String(tx.accountId) === String(filterAccount) || 
        String(tx.sourceAccountId) === String(filterAccount) || 
        String(tx.targetAccountId) === String(filterAccount) ||
        String(tx.account?.id) === String(filterAccount)
      );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', fontFamily: 'Outfit' }}>
            Transaction History
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>View and filter your past transactions.</p>
        </div>
        
        {accounts.length > 0 && (
          <select 
            value={filterAccount} 
            onChange={(e) => setFilterAccount(e.target.value)}
            style={{ padding: '0.5rem 1rem', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.3)', color: 'var(--text-primary)', borderRadius: '12px', outline: 'none' }}
          >
            <option value="ALL">All Accounts</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>Account #{acc.id}</option>
            ))}
          </select>
        )}
      </div>

      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255, 68, 68, 0.1)', borderRadius: '12px' }}>{error}</div>}

      {transactions.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: '12px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No transactions found.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '0', borderRadius: '12px', overflow: 'hidden' }}>
          {filteredTransactions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No transactions found for the selected account.</p>
            </div>
          ) : (() => {
            const userAccountIds = accounts.map(acc => String(acc.id));
            return filteredTransactions.map((tx, idx) => {
              // Define if it's a credit based on the context (filtered account or overall)
              let isCredit = false;
              if (filterAccount !== 'ALL') {
                // If viewing a single account, it's a credit if it's a deposit or incoming transfer
                isCredit = tx.type === 'DEPOSIT' || tx.type === 'CREDIT' || tx.type === 'LOAN_DISBURSEMENT' || tx.type === 'DISBURSEMENT' || (tx.type === 'TRANSFER' && String(tx.targetAccountId) === String(filterAccount));
              } else {
                // If viewing all accounts, it's a credit if it adds money from outside or is a deposit
                isCredit = tx.type === 'DEPOSIT' || tx.type === 'CREDIT' || tx.type === 'LOAN_DISBURSEMENT' || tx.type === 'DISBURSEMENT' || (tx.type === 'TRANSFER' && userAccountIds.includes(String(tx.targetAccountId)) && !userAccountIds.includes(String(tx.sourceAccountId)));
                
                // For internal transfers in "ALL" view, we decide based on the record we are currently processing.
                // Since we flat mapped results from all accounts, internal transfers appear twice.
                // One for source (debit) and one for target (credit).
                if (tx.type === 'TRANSFER' && userAccountIds.includes(String(tx.sourceAccountId)) && userAccountIds.includes(String(tx.targetAccountId))) {
                   // If it's the version of the txn for the target account, it's a credit
                   isCredit = String(tx.accountId || tx.account?.id) === String(tx.targetAccountId);
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
                <div key={tx.id || idx} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '1.5rem', borderBottom: idx < filteredTransactions.length - 1 ? '1px solid var(--surface-border)' : 'none',
                  transition: 'background-color 0.2s ease'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem', textTransform: 'capitalize' }}>
                      {txTitle}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {tx.timestamp || tx.createdAt ? new Date(tx.timestamp || tx.createdAt).toLocaleString() : 'Recent'}
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: isCredit ? 'var(--success-color)' : 'var(--danger-color)' }}>
                    {sign}₹{Math.abs(tx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })
          })()}
        </div>
      )}
    </div>
  );
};

export default Transactions;
