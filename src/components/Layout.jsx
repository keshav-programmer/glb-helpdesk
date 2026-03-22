import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard',     label: 'Home',          icon: HomeIcon },
    { path: '/new-complaint', label: 'New Complaint',  icon: PlusIcon },
    { path: '/my-complaints', label: 'My Complaints',  icon: ListIcon },
    ...(user?.role === 'admin'
      ? [{ path: '/admin', label: 'Admin', icon: ShieldIcon }]
      : []),
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          padding: '0 20px', height: 60,
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 12,
        }}>

          {/* ── Logo ── */}
          <Link to="/dashboard" style={{
            textDecoration: 'none',
            display: 'flex', alignItems: 'center',
            gap: 9, flexShrink: 0,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--indigo), var(--violet))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 15, color: 'white',
              boxShadow: '0 4px 10px rgba(99,102,241,0.4)',
              flexShrink: 0,
            }}>G</div>
            {/* Hide app name on very small screens */}
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 600,
              fontSize: 15, color: 'var(--text)',
              letterSpacing: '-0.2px',
              display: window.innerWidth < 400 ? 'none' : 'block',
            }}>GLB Helpdesk</span>
          </Link>

          {/* ── Desktop nav links ── */}
          {/* Hidden on mobile, replaced by bottom nav */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 2,
            // Hide on mobile
            ...(window.innerWidth <= 640 ? { display: 'none' } : {}),
          }} className="tablet-hide mobile-hide">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <Link key={path} to={path} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '7px 13px', borderRadius: 8,
                  fontSize: 13, fontWeight: 500,
                  textDecoration: 'none',
                  color: active ? 'white' : 'var(--text-muted)',
                  background: active ? 'rgba(99,102,241,0.2)' : 'transparent',
                  border: active
                    ? '1px solid rgba(99,102,241,0.3)'
                    : '1px solid transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.color = 'var(--text)';
                    e.currentTarget.style.background = 'var(--bg-hover)';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* ── Right side ── */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 10, flexShrink: 0,
          }}>
            {/* Admin badge — hide on small screens */}
            {user?.role === 'admin' && (
              <span className="mobile-hide" style={{
                fontSize: 10, fontWeight: 600,
                padding: '3px 8px', borderRadius: 20,
                letterSpacing: '0.05em',
                background: 'rgba(139,92,246,0.15)',
                color: '#a78bfa',
                border: '1px solid rgba(139,92,246,0.3)',
                textTransform: 'uppercase',
              }}>Admin</span>
            )}

            {/* Avatar */}
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} style={{
                width: 30, height: 30, borderRadius: '50%',
                border: '2px solid var(--border-brand)',
                objectFit: 'cover', flexShrink: 0,
              }} />
            ) : (
              <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--indigo), var(--violet))',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12, fontWeight: 600, color: 'white',
              }}>
                {user?.name?.[0] ?? 'U'}
              </div>
            )}

            {/* Name — hide on mobile */}
            <span className="mobile-hide" style={{
              fontSize: 13, color: 'var(--text-muted)',
              maxWidth: 90, overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user?.name?.split(' ')[0]}
            </span>

            {/* Sign out — show short version on mobile */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: 12, padding: '6px 10px' }}
            >
              {loggingOut ? '...' : 'Sign out'}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile bottom navigation bar ── */}
      {/* Only visible on phones — replaces the top nav links */}
      <div style={{
        display: 'none', // shown via media query below
        position: 'fixed', bottom: 0, left: 0, right: 0,
        zIndex: 100,
        background: 'rgba(15,23,42,0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
        padding: '8px 0 12px',
      }} className="mobile-bottom-nav">
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
          {navLinks.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 4,
                padding: '6px 16px', borderRadius: 10,
                textDecoration: 'none',
                color: active ? 'var(--indigo)' : 'var(--text-faint)',
                transition: 'color 0.15s',
                minWidth: 60,
              }}>
                <Icon size={20} />
                <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Page content ── */}
      {/* Extra bottom padding on mobile so content isn't behind bottom nav */}
      <main style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '28px 20px',
        paddingBottom: 'calc(80px + 20px)', // space for mobile bottom nav
      }}>
        {children}
      </main>

      {/* ── Inline style for mobile bottom nav visibility ── */}
      <style>{`
        @media (max-width: 640px) {
          .mobile-bottom-nav { display: block !important; }
          .mobile-hide { display: none !important; }
          .tablet-hide { display: none !important; }
        }
        @media (min-width: 641px) {
          main { padding-bottom: 28px !important; }
        }
      `}</style>
    </div>
  );
}

// ── Icons ─────────────────────────────────────
function HomeIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function PlusIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  );
}
function ListIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  );
}
function ShieldIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}