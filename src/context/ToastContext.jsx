import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000); // 4 seconds before disappearing
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ 
        position: 'fixed', 
        bottom: '30px', 
        right: '30px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        zIndex: 9999,
        pointerEvents: 'none' // Don't block clicks beneath them
      }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{
            background: toast.type === 'error' ? 'var(--danger-color)' : (toast.type === 'success' ? '#00e676' : 'var(--primary-color)'),
            color: '#000', 
            padding: '14px 24px', 
            borderRadius: '12px', 
            fontWeight: 'bold', 
            fontSize: '1rem',
            boxShadow: '0 8px 16px rgba(0,0,0,0.4)', 
            animation: 'slideInRight 0.3s ease', 
            whiteSpace: 'pre-wrap', 
            minWidth: '250px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            {toast.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
