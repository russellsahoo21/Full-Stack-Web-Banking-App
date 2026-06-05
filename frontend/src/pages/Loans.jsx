import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useToast } from '../context/ToastContext';
import { HandCoins, TrendingUp, Calendar, ArrowRight, DollarSign, Wallet, AlertCircle, ShieldCheck, X } from 'lucide-react';

const Loans = () => {
  const { showToast } = useToast();
  const [loans, setLoans] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Sections state
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [showRepayModal, setShowRepayModal] = useState(false);
  const applyFormRef = useRef(null);
  
  // Form state
  const [submitting, setSubmitting] = useState(false);
  const [applyData, setApplyData] = useState({ 
    amount: '', 
    durationMonths: '12', 
    destinationAccountId: '', 
    pin: '' 
  });
  const [repayData, setRepayData] = useState({ 
    loanId: null, 
    amount: '', 
    pin: '' 
  });
  
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      const [loanData, accountsData] = await Promise.all([
        api.getLoans(),
        api.getAccounts().catch(() => []) 
      ]);
      
      let loanList = [];
      if (Array.isArray(loanData)) {
        loanList = loanData;
      } else if (loanData && typeof loanData === 'object') {
        loanList = loanData.loans || loanData.content || loanData.data || (loanData._embedded ? loanData._embedded.loans : null) || [];
        if (!Array.isArray(loanList)) {
          loanList = [loanData];
        }
      }
      setLoans(loanList);
      
      const accList = Array.isArray(accountsData) ? accountsData : (accountsData ? [accountsData] : []);
      setAccounts(accList);
      
      if (accList.length > 0 && !applyData.destinationAccountId) {
        setApplyData(prev => ({ ...prev, destinationAccountId: String(accList[0].id) }));
      }
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.message || 'Failed to fetch loan data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [navigate]);

  useEffect(() => {
    if (showApplyForm && applyFormRef.current) {
      applyFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showApplyForm]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!applyData.pin || applyData.pin.length < 4) {
      showToast('Please enter your 4-6 digit transaction PIN', 'error');
      return;
    }
    
    try {
      setSubmitting(true);
      await api.applyLoan({
        amount: parseFloat(applyData.amount),
        durationMonths: parseInt(applyData.durationMonths),
        destinationAccountId: applyData.destinationAccountId,
        pin: applyData.pin
      });
      showToast('Loan application submitted successfully', 'success');
      setShowApplyForm(false);
      setApplyData({ amount: '', durationMonths: '12', destinationAccountId: accounts[0]?.id || '', pin: '' });
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to apply for loan', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRepay = async (e) => {
    e.preventDefault();
    if (!repayData.pin || repayData.pin.length < 4) {
      showToast('Please enter your transaction PIN', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await api.repayLoan(repayData.loanId, parseFloat(repayData.amount), repayData.pin);
      showToast('Repayment successful', 'success');
      setShowRepayModal(false);
      setRepayData({ loanId: null, amount: '', pin: '' });
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to process repayment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const totalOutstanding = loans.reduce((acc, curr) => {
    const balance = curr.remainingBalance ?? curr.balance ?? curr.outstandingAmount ?? curr.amount ?? 0;
    return acc + balance;
  }, 0);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem', fontFamily: 'Outfit' }}>
            <span style={{ color: 'var(--text-primary)' }}>Loans</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your credit and repayments</p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem', fontSize: '1rem' }}>
            Total Outstanding Balance
          </p>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Outfit', color: 'var(--danger-color)' }}>
            ₹{totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>My Active Loans ({loans.length})</h2>
        {!showApplyForm && (
          <button 
            className="btn btn-primary" 
            style={{ borderRadius: 0, padding: '0.75rem 2rem' }}
            onClick={() => setShowApplyForm(true)}
          >
            + Quick Loan Apply
          </button>
        )}
      </div>

      {/* In-Page Apply Form */}
      {showApplyForm && (
        <div 
          ref={applyFormRef}
          className="animate-slide-down"
          style={{ 
            background: 'var(--surface-color)', 
            border: '1px solid var(--surface-border)', 
            borderTop: '3px solid var(--primary-color)',
            padding: '2.5rem', 
            marginBottom: '3rem', 
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>Apply for a New Loan</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0', fontSize: '0.9rem' }}>Fill in the details below to secure your funding.</p>
            </div>
            <button 
              onClick={() => setShowApplyForm(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem' }}
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleApply}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
              
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Loan Amount (₹)</label>
                <div style={{ position: 'relative' }}>
                   <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontWeight: 'bold' }}>₹</span>
                   <input 
                    type="number" 
                    className="input-field" 
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="e.g. 50000" 
                    required 
                    value={applyData.amount}
                    onChange={(e) => setApplyData({...applyData, amount: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Disbursement Account</label>
                <select 
                  className="input-field" 
                  required
                  value={applyData.destinationAccountId}
                  onChange={(e) => setApplyData({...applyData, destinationAccountId: e.target.value})}
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>Account #{acc.id} (Balance: ₹{acc.balance?.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Term (Months)</label>
                <select 
                  className="input-field" 
                  value={applyData.durationMonths}
                  onChange={(e) => setApplyData({...applyData, durationMonths: e.target.value})}
                >
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                  <option value="24">24 Months</option>
                  <option value="36">36 Months</option>
                  <option value="48">48 Months</option>
                </select>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Transaction PIN</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="password" 
                    className="input-field" 
                    placeholder="••••" 
                    required 
                    maxLength="6"
                    value={applyData.pin}
                    onChange={(e) => setApplyData({...applyData, pin: e.target.value.replace(/\D/g, '')})}
                    style={{ paddingLeft: '3rem' }}
                  />
                  <ShieldCheck size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', borderTop: '1px solid var(--surface-border)', paddingTop: '2rem' }}>
              <div style={{ background: 'rgba(212, 175, 55, 0.05)', padding: '1rem 1.5rem', borderRadius: '4px', border: '1px dashed var(--primary-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Interest Rate</div>
                <div style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.2rem' }}>10.5% p.a.</div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn btn-secondary" style={{ padding: '0.75rem 2rem' }} onClick={() => setShowApplyForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 3rem' }} disabled={submitting || accounts.length === 0}>
                   {submitting ? 'Processing...' : 'Apply & Secure Funds'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {error && <div className="glass-panel" style={{ color: 'var(--danger-color)', marginBottom: '1.5rem', padding: '1rem', borderLeft: '4px solid var(--danger-color)', background: 'rgba(239, 68, 68, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      </div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading loans...</p>
        </div>
      ) : loans.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <HandCoins color="var(--primary-color)" size={32} />
          </div>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>No active loans found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Need extra funds precisely? Apply for a personal loan with 10.5% interest rate.</p>
          <button className="btn btn-primary" style={{ borderRadius: 0 }} onClick={() => setShowApplyForm(true)}>
            Apply Now
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '0', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-border)', background: 'var(--surface-light)' }}>
                  <th style={{ padding: '1.25rem 2rem', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.85rem', textTransform: 'uppercase' }}>Loan Details</th>
                  <th style={{ padding: '1.25rem 2rem', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.85rem', textTransform: 'uppercase' }}>Principal</th>
                  <th style={{ padding: '1.25rem 2rem', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.85rem', textTransform: 'uppercase' }}>Interest</th>
                  <th style={{ padding: '1.25rem 2rem', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.85rem', textTransform: 'uppercase' }}>Remaining</th>
                  <th style={{ padding: '1.25rem 2rem', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan, idx) => (
                  <tr key={`loan-${loan.id}-${idx}`} style={{ borderBottom: idx < loans.length - 1 ? '1px solid var(--surface-border)' : 'none', transition: 'background 0.2s' }} className="table-row-hover">
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                          <Wallet size={18} color="var(--primary-color)" />
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Loan #{loan.id}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Term: {loan.durationMonths || loan.durationInMonths} Months</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ fontWeight: '500' }}>₹{(loan.amount || 0).toLocaleString()}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(loan.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '500' }}>
                        <TrendingUp size={14} /> {loan.interestRate || '10.5'}% <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>p.a.</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        ₹{(loan.remainingBalance ?? loan.balance ?? loan.outstandingAmount ?? 0).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Status: {loan.status || 'Active'}</div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        onClick={() => {
                          setRepayData({ loanId: loan.id, amount: '', pin: '' });
                          setShowRepayModal(true);
                        }}
                      >
                        Repay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Repay Loan Modal - Kept as modal for focused action */}
      {showRepayModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', position: 'relative' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Repay Loan</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Make a payment towards Loan #{repayData.loanId}</p>
            
            <form onSubmit={handleRepay}>
              <div className="input-group">
                <label className="input-label">Repayment Amount (₹)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="Enter amount" 
                  required 
                  value={repayData.amount}
                  onChange={(e) => setRepayData({...repayData, amount: e.target.value})}
                />
              </div>

              <div className="input-group" style={{ position: 'relative' }}>
                <label className="input-label">Transaction PIN</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="password" 
                    className="input-field" 
                    placeholder="••••" 
                    required 
                    maxLength="6"
                    value={repayData.pin}
                    onChange={(e) => setRepayData({...repayData, pin: e.target.value.replace(/\D/g, '')})}
                    style={{ paddingLeft: '3rem' }}
                  />
                  <ShieldCheck size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowRepayModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={submitting}>
                  {submitting ? 'Processing...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .table-row-hover:hover {
          background: var(--surface-light);
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-slide-down {
          animation: slideDown 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Loans;
