import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Settings = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobileNumber: '',
    address: '',
    dob: '',
    gender: '',
    occupation: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await api.getMe();
        setFormData({
          username: userProfile.username || '',
          email: userProfile.email || '',
          mobileNumber: userProfile.mobileNumber || '',
          address: userProfile.address || '',
          dob: userProfile.dob || '',
          gender: userProfile.gender || '',
          occupation: userProfile.occupation || ''
        });
      } catch (err) {
        setError('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const { username, email, ...updatePayload } = formData;
      await api.updateProfile(updatePayload);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', fontFamily: 'Outfit' }}>
          Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Update your personal details below.</p>
      </div>

      <div style={{ width: '100%', paddingBottom: '2rem' }}>
        {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255, 68, 68, 0.1)', borderRadius: '4px' }}>{error}</div>}
        {success && <div style={{ color: 'var(--primary-color)', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(0, 255, 157, 0.1)', borderRadius: '4px' }}>{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Name</label>
              <input
                type="text"
                value={formData.username}
                disabled
                className="form-control"
                style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', borderRadius: '12px', cursor: 'not-allowed', textTransform: 'capitalize' }}
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
              <input
                type="text"
                value={formData.email}
                disabled
                className="form-control"
                style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', borderRadius: '12px', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="form-control"
              style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.3)', color: 'var(--text-primary)', borderRadius: '12px', transition: 'all 0.3s ease' }}
              placeholder="e.g. +1 234 567 890"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-control"
              style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.3)', color: 'var(--text-primary)', borderRadius: '12px', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit', transition: 'all 0.3s ease' }}
              placeholder="Your full address"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="form-control"
              style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.3)', color: 'var(--text-primary)', borderRadius: '12px', transition: 'all 0.3s ease' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-control"
              style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.3)', color: 'var(--text-primary)', borderRadius: '12px', transition: 'all 0.3s ease' }}
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Occupation</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="form-control"
              style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.3)', color: 'var(--text-primary)', borderRadius: '12px', transition: 'all 0.3s ease' }}
              placeholder="e.g. Software Engineer"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={saving}
            style={{ padding: '1rem', marginTop: '1.5rem', width: '100%', fontSize: '1rem', fontWeight: 'bold', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '1px', transition: 'background-color 0.3s ease' }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
