import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────────
// MOCK NEW COMPLAINTS FOR NOTIFICATION BELL
// Replace with real API polling later
// ─────────────────────────────────────────────
const MOCK_NEW_COMPLAINTS = [
  {
    _id: 'n1', ticketId: 'GLB-0006',
    issueType: 'fan', category: 'hostel',
    floor: '4', roomNumber: '402',
    student: 'Rohit Gupta',
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
  },
  {
    _id: 'n2', ticketId: 'GLB-0007',
    issueType: 'light', category: 'classroom',
    floor: '2', roomNumber: 'CS-201',
    student: 'Sneha Rao',
    createdAt: new Date(Date.now() - 18 * 60 * 1000), // 18 mins ago
  },
  {
    _id: 'n3', ticketId: 'GLB-0008',
    issueType: 'ac', category: 'hostel',
    floor: '1', roomNumber: '108',
    student: 'Arjun Mehta',
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
  },
];

// Format time ago — e.g. "5m ago", "2h ago"
function timeAgo(date) {
  const mins = Math.floor((Date.now() - new Date(date)) / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const ISSUE_ICONS = {
  fan: '🌀', window: '🪟', door: '🚪',
  table: '🛋️', chair: '🪑', light: '💡',
  ac: '❄️', projector: '📽️', other: '🔧',
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();

  const [loggingOut, setLoggingOut]         = useState(false);
  const [bellOpen, setBellOpen]             = useState(false);
  // Track which notifications have been read
  const [readIds, setReadIds]               = useState([]);
  const bellRef = useRef(null);

  const isAdmin = user?.role === 'admin';

  // ── Nav links — different for admin vs student ──
  const studentLinks = [
    { path: '/dashboard',     label: 'Home',          icon: HomeIcon   },
    { path: '/new-complaint', label: 'New Complaint',  icon: PlusIcon   },
    { path: '/my-complaints', label: 'My Complaints',  icon: ListIcon   },
  ];

  const adminLinks = [
    { path: '/admin', label: 'Admin Panel', icon: ShieldIcon },
  ];

  // Admin sees only admin links, students see student links
  const navLinks = isAdmin ? adminLinks : studentLinks;

  // Unread notifications = new complaints not yet read
  const unread = MOCK_NEW_COMPLAINTS.filter(n => !readIds.includes(n._id));
  const hasUnread = unread.length > 0;

  // Mark all as read when bell is opened
  const handleBellClick = () => {
    setBellOpen(prev => !prev);
    if (!bellOpen) {
      setReadIds(MOCK_NEW_COMPLAINTS.map(n => n._id));
    }
  };

  // Close bell dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(15,23,42,0.9)',
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
          <Link to={isAdmin ? '/admin' : '/dashboard'} style={{
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
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 600,
              fontSize: 15, color: 'var(--text)', letterSpacing: '-0.2px',
            }}>GLB Helpdesk</span>
          </Link>

          {/* ── Nav links ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}
            className="mobile-hide tablet-hide">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <Link key={path} to={path} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '7px 13px', borderRadius: 8,
                  fontSize: 13, fontWeight: 500,
                  textDecoration: 'none',
                  color: active ? 'white' : 'var(--text-muted)',
                  background: active
                    ? isAdmin
                      ? 'rgba(139,92,246,0.2)'
                      : 'rgba(99,102,241,0.2)'
                    : 'transparent',
                  border: active
                    ? `1px solid ${isAdmin
                        ? 'rgba(139,92,246,0.3)'
                        : 'rgba(99,102,241,0.3)'}`
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

            {/* ── Bell notification icon — admin only ── */}
            {isAdmin && (
              <div ref={bellRef} style={{ position: 'relative' }}>
                {/* Bell button */}
                <button
                  onClick={handleBellClick}
                  style={{
                    position: 'relative',
                    width: 36, height: 36, borderRadius: 9,
                    background: bellOpen ? 'var(--bg-hover)' : 'var(--bg-card)',
                    border: `1px solid ${bellOpen ? 'var(--border-hover)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer',
                    transition: 'all 0.15s',
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                    e.currentTarget.style.borderColor = 'var(--border-hover)';
                    e.currentTarget.style.color = 'var(--text)';
                  }}
                  onMouseLeave={e => {
                    if (!bellOpen) {
                      e.currentTarget.style.background = 'var(--bg-card)';
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }
                  }}
                >
                  <BellIcon size={16} />

                  {/* Orange dot — shown when there are unread notifications */}
                  {hasUnread && (
                    <div style={{
                      position: 'absolute', top: 6, right: 6,
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#f97316',
                      border: '2px solid var(--bg)',
                      animation: 'pulse-orange 2s infinite',
                    }}/>
                  )}
                </button>

                {/* ── Notification dropdown ── */}
                {bellOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)',
                    right: 0, width: 340,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                    boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                    animation: 'fadeUp 0.2s ease both',
                    overflow: 'hidden',
                    zIndex: 200,
                  }}>
                    {/* Dropdown header */}
                    <div style={{
                      padding: '14px 16px',
                      borderBottom: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <div>
                        <span style={{
                          fontSize: 13, fontWeight: 600,
                          color: 'var(--text)',
                        }}>New Complaints</span>
                        {hasUnread && (
                          <span style={{
                            marginLeft: 8, fontSize: 10,
                            fontWeight: 600, padding: '2px 7px',
                            borderRadius: 20,
                            background: 'rgba(249,115,22,0.15)',
                            color: '#f97316',
                            border: '1px solid rgba(249,115,22,0.3)',
                          }}>
                            {unread.length} NEW
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                        Latest updates
                      </span>
                    </div>

                    {/* Notification items */}
                    <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                      {MOCK_NEW_COMPLAINTS.map((n, i) => (
                        <div
                          key={n._id}
                          onClick={() => {
                            setBellOpen(false);
                            navigate('/admin');
                          }}
                          style={{
                            padding: '12px 16px',
                            borderBottom: i < MOCK_NEW_COMPLAINTS.length - 1
                              ? '1px solid var(--border)' : 'none',
                            display: 'flex', gap: 12,
                            alignItems: 'flex-start',
                            cursor: 'pointer',
                            transition: 'background 0.15s',
                            // Highlight unread items
                            background: readIds.includes(n._id)
                              ? 'transparent'
                              : 'rgba(249,115,22,0.04)',
                          }}
                          onMouseEnter={e =>
                            e.currentTarget.style.background = 'var(--bg-hover)'}
                          onMouseLeave={e =>
                            e.currentTarget.style.background = readIds.includes(n._id)
                              ? 'transparent'
                              : 'rgba(249,115,22,0.04)'}
                        >
                          {/* Issue icon box */}
                          <div style={{
                            width: 36, height: 36, borderRadius: 9,
                            flexShrink: 0,
                            background: 'rgba(99,102,241,0.12)',
                            border: '1px solid rgba(99,102,241,0.2)',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 17,
                          }}>
                            {ISSUE_ICONS[n.issueType] || '🔧'}
                          </div>

                          {/* Notification text */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 13, fontWeight: 500,
                              color: 'var(--text)', marginBottom: 2,
                              textTransform: 'capitalize',
                            }}>
                              {n.issueType} issue — {n.category}
                            </div>
                            <div style={{
                              fontSize: 11, color: 'var(--text-faint)',
                              marginBottom: 3,
                            }}>
                              {n.student} · Floor {n.floor}, Room {n.roomNumber}
                            </div>
                            <div style={{
                              fontSize: 11, color: 'var(--text-faint)',
                              display: 'flex', alignItems: 'center',
                              gap: 5,
                            }}>
                              <span style={{
                                color: '#f97316',
                                fontFamily: 'var(--font-mono)',
                              }}>{n.ticketId}</span>
                              <span style={{ opacity: 0.4 }}>·</span>
                              <span>{timeAgo(n.createdAt)}</span>
                            </div>
                          </div>

                          {/* Unread orange dot */}
                          {!readIds.includes(n._id) && (
                            <div style={{
                              width: 7, height: 7,
                              borderRadius: '50%',
                              background: '#f97316',
                              flexShrink: 0, marginTop: 5,
                            }}/>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div style={{
                      padding: '10px 16px',
                      borderTop: '1px solid var(--border)',
                      textAlign: 'center',
                    }}>
                      <Link
                        to="/admin"
                        onClick={() => setBellOpen(false)}
                        style={{
                          fontSize: 12, color: 'var(--indigo)',
                          textDecoration: 'none', fontWeight: 500,
                        }}
                      >
                        View all in Admin Panel →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Admin badge */}
            {isAdmin && (
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
              }}/>
            ) : (
              <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--indigo), var(--violet))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600, color: 'white',
              }}>
                {user?.name?.[0] ?? 'U'}
              </div>
            )}

            {/* Name */}
            <span className="mobile-hide" style={{
              fontSize: 13, color: 'var(--text-muted)',
              maxWidth: 90, overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user?.name?.split(' ')[0]}
            </span>

            {/* Sign out */}
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

      {/* ── Mobile bottom nav — students only ── */}
      {!isAdmin && (
        <div style={{
          display: 'none',
          position: 'fixed', bottom: 0, left: 0, right: 0,
          zIndex: 100,
          background: 'rgba(15,23,42,0.95)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--border)',
          padding: '8px 0 12px',
        }} className="mobile-bottom-nav">
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {studentLinks.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <Link key={path} to={path} style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 4,
                  padding: '6px 16px', borderRadius: 10,
                  textDecoration: 'none',
                  color: active ? 'var(--indigo)' : 'var(--text-faint)',
                  transition: 'color 0.15s', minWidth: 60,
                }}>
                  <Icon size={20} />
                  <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Page content ── */}
      <main style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '28px 20px',
        paddingBottom: !isAdmin ? 'calc(80px + 20px)' : '28px',
      }}>
        {children}
      </main>

      {/* ── Global styles ── */}
      <style>{`
        @keyframes pulse-orange {
          0%   { box-shadow: 0 0 0 0 rgba(249,115,22,0.5); }
          70%  { box-shadow: 0 0 0 5px rgba(249,115,22,0); }
          100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); }
        }
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
function BellIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}