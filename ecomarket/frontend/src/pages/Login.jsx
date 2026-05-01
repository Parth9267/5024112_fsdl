import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const { data } = await axios.post(`http://localhost:5000${endpoint}`, formData);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
    } catch (error) {
      alert(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ 
      background: 'radial-gradient(circle at center, #ffffff 0%, #f0f4f0 100%)' 
    }}>
      <div className="card p-5 border-0" style={{ 
        width: '100%', 
        maxWidth: '460px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
        borderRadius: '1.25rem'
      }}>
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle mb-3" style={{ width: '64px', height: '64px' }}>
            <span style={{ fontSize: '2rem' }}>🌱</span>
          </div>
          <h2 className="fw-bolder text-dark mb-1" style={{ letterSpacing: '-0.5px' }}>
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>
            {isLogin ? 'Enter your details to access your dashboard.' : 'Start recycling and earning today.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
              <input type="text" name="name" className="form-control form-control-lg bg-light border-0" placeholder="e.g. Jane Doe" onChange={handleChange} required />
            </div>
          )}
          <div className="mb-4">
            <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
            <input type="email" name="email" className="form-control form-control-lg bg-light border-0" placeholder="name@company.com" onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <input type="password" name="password" className="form-control form-control-lg bg-light border-0" placeholder="••••••••" onChange={handleChange} required />
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account Type</label>
              <select name="role" className="form-select form-select-lg bg-light border-0" onChange={handleChange}>
                <option value="buyer">Buyer (Scrap Dealer / Recycler)</option>
                <option value="seller">Seller (Household / Individual)</option>
              </select>
            </div>
          )}
          
          <button type="submit" className="btn btn-enterprise w-100 py-3 mt-2 mb-4" style={{ fontSize: '1.05rem' }} disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2" role="status" /> : null}
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button className="btn btn-link text-success fw-semibold p-0 ms-2 text-decoration-none" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Create one now' : 'Sign in instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
