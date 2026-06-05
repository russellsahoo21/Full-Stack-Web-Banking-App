import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Landmark color="var(--primary-color)" size={24} />
        Banking App
      </Link>
      <div className="navbar-nav">
        {token ? (
          <>
            <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
