import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ user, setUser, activeView, setActiveView }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleColor = user?.role === 'seller' ? 'success' : 'primary';

  const menuItems = [
    { key: 'dashboard', icon: '📊', label: 'Dashboard', desc: 'Overview & metrics' },
    { key: 'listings', icon: '📦', label: 'My Listings', desc: 'Manage your posts' },
    { key: 'bidding', icon: '💰', label: 'Bidding & Offers', desc: 'Active bids & negotiations' },
    { key: 'messages', icon: '💬', label: 'Messages', desc: 'Chat with buyers/sellers' },
    { key: 'impact', icon: '🌍', label: 'Environmental Impact', desc: 'CO₂ savings & stats' },
    { key: 'profile', icon: '👤', label: 'Profile & Ratings', desc: 'Your reputation score' },
  ];

  return (
    <nav className="navbar navbar-expand-lg enterprise-nav sticky-top py-3">
      <div className="container">
        <span className="navbar-brand d-flex align-items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => setActiveView && setActiveView('dashboard')}>
          <span style={{ fontSize: '1.4rem' }}>🌱</span> EcoMarket
        </span>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex flex-column align-items-end" style={{ lineHeight: '1.2' }}>
            <span className="fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>{user?.name}</span>
            <span className={`badge bg-${roleColor} bg-opacity-10 text-${roleColor} border border-${roleColor} text-capitalize`} style={{ fontSize: '0.7rem' }}>
              {user?.role}
            </span>
          </div>

          {/* Three-dot menu */}
          <div className="position-relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn btn-sm three-dot-btn"
              id="nav-menu-trigger"
              aria-label="Open features menu"
            >
              <span className="three-dots">⋮</span>
            </button>

            {menuOpen && (
              <div className="feature-menu" id="feature-dropdown-menu">
                <div className="feature-menu-header">
                  <span className="fw-bold" style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Features</span>
                </div>
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    className={`feature-menu-item ${activeView === item.key ? 'active' : ''}`}
                    onClick={() => {
                      setActiveView && setActiveView(item.key);
                      setMenuOpen(false);
                    }}
                  >
                    <span className="feature-menu-icon">{item.icon}</span>
                    <div className="feature-menu-text">
                      <span className="feature-menu-label">{item.label}</span>
                      <span className="feature-menu-desc">{item.desc}</span>
                    </div>
                    {activeView === item.key && <span className="feature-menu-active-dot"></span>}
                  </button>
                ))}
                <div className="feature-menu-divider"></div>
                <button onClick={handleLogout} className="feature-menu-item feature-menu-logout">
                  <span className="feature-menu-icon">🚪</span>
                  <div className="feature-menu-text">
                    <span className="feature-menu-label">Logout</span>
                    <span className="feature-menu-desc">Sign out of your account</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
