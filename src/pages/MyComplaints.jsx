import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────
// ICON MAP
// Maps issue type string to an emoji icon
// Used in complaint cards
// ─────────────────────────────────────────────
const ISSUE_ICONS = {
  fan: '🌀', window: '🪟', door: '🚪',
  table: '🛋️', chair: '🪑', light: '💡',
  ac: '❄️', projector: '📽️', other: '🔧',
};

// ─────────────────────────────────────────────
// MOCK DATA
// Fake complaints for UI testing
// Replace with real API call later
// ─────────────────────────────────────────────
const MOCK_COMPLAINTS = [
  {
    _id: '1', ticketId: 'GLB-0001',
    category: 'hostel', issueType: 'fan',
    floor: '2', roomNumber: '204',
    status: 'open', description: 'Fan makes loud noise and stops after 5 minutes.',
    assignedTo: '', adminNote: '',
    createdAt: new Date('2026-03-20'),
  },
  {
    _id: '2', ticketId: 'GLB-0002',
    category: 'classroom', issueType: 'projector',
    floor: '1', roomNumber: 'CS-101',
    status: 'in-progress', description: 'Projector does not display anything.',
    assignedTo: 'Raju Electrician', adminNote: 'Part ordered, will fix by tomorrow.',
    createdAt: new Date('2026-03-19'),
  },
  {
    _id: '3', ticketId: 'GLB-0003',
    category: 'hostel', issueType: 'light',
    floor: '3', roomNumber: '310',
    status: 'resolved', description: '',
    assignedTo: 'Suresh Kumar', adminNote: 'Bulb replaced.',
    createdAt: new Date('2026-03-18'),
  },
  {
    _id: '4', ticketId: 'GLB-0004',
    category: 'classroom', issueType: 'ac',
    floor: '2', roomNumber: 'ME-201',
    status: 'open', description: 'AC not cooling at all.',
    assignedTo: '', adminNote: '',
    createdAt: new Date('2026-03-17'),
  },
];

// Filter tab options
const FILTERS = [
  { value: 'all',         label: 'All' },
  { value: 'open',        label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved',    label: 'Resolved' },
];

// ─────────────────────────────────────────────
// STATUS BADGE COMPONENT
// Reusable pill badge showing complaint status
// ─────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    'open':        { label: 'Open',        cls: 'badge-open'     },
    'in-progress': { label: 'In Progress', cls: 'badge-progress' },
    'resolved':    { label: 'Resolved',    cls: 'badge-resolved' },
  };
  const { label, cls } = map[status] || { label: status, cls: '' };
  return <span className={`badge ${cls}`}>{label}</span>;
}

// ─────────────────────────────────────────────
// COMPLAINT CARD COMPONENT
// Expandable card showing complaint details
// Clicking anywhere on it toggles expanded view
// ─────────────────────────────────────────────
function ComplaintCard({ complaint, index }) {
  // Track whether this card is expanded or collapsed
  const [expanded, setExpanded] = useState(false);

  const {
    ticketId, category, issueType,
    floor, roomNumber, status,
    description, assignedTo, adminNote,
    createdAt,
  } = complaint;

  return (
    <div
      className="card"
      style={{
        overflow: 'hidden',
        // Stagger each card's fade-in animation
        animation: `fadeUp 0.4s ease both ${index * 0.07}s`,
        transition: 'border-color 0.2s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* ── Card header — always visible, click to expand ── */}
      <div
        onClick={() => setExpanded(prev => !prev)}
        style={{
          padding: '16px 20px',
          display: 'flex', alignItems: 'center',
          gap: 14, cursor: 'pointer',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {/* Issue icon box */}
        <div style={{
          width: 44, height: 44, borderRadius: 11, flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
          border: '1px solid rgba(99,102,241,0.2)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 22,
        }}>
          {ISSUE_ICONS[issueType] || '🔧'}
        </div>

        {/* Title + meta info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14, fontWeight: 500,
            color: 'var(--text)', textTransform: 'capitalize',
            marginBottom: 4,
          }}>
            {issueType} issue — {category}
          </div>
          <div style={{
            fontSize: 12, color: 'var(--text-faint)',
            display: 'flex', alignItems: 'center',
            gap: 6, flexWrap: 'wrap',
          }}>
            <span>{ticketId}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>Floor {floor}, Room {roomNumber}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>
              {new Date(createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* Status badge + expand arrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <StatusBadge status={status} />
          {/* Arrow rotates 180° when expanded */}
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round"
            style={{
              color: 'var(--text-faint)',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s ease',
            }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* ── Expanded detail section ── */}
      {/* Shows only when card is clicked/expanded */}
      {expanded && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '20px',
          background: 'rgba(255,255,255,0.02)',
          animation: 'fadeUp 0.2s ease both',
        }}>
          {/* Detail grid — 2 columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16, marginBottom: 16,
          }}>
            {/* Each detail item: label on top, value below */}
            {[
              { label: 'Ticket ID',    value: ticketId },
              { label: 'Category',     value: category },
              { label: 'Location',     value: `Floor ${floor}, Room ${roomNumber}` },
              { label: 'Issue Type',   value: issueType },
              { label: 'Submitted',    value: new Date(createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
              { label: 'Status',       value: <StatusBadge status={status} /> },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{
                  fontSize: 10, fontWeight: 500,
                  color: 'var(--text-faint)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 4,
                }}>{label}</div>
                <div style={{
                  fontSize: 13, color: 'var(--text)',
                  textTransform: typeof value === 'string' ? 'capitalize' : 'none',
                }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Description — only show if student added one */}
          {description && (
            <div style={{ marginBottom: 14 }}>
              <div style={{
                fontSize: 10, fontWeight: 500,
                color: 'var(--text-faint)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em', marginBottom: 4,
              }}>Your Description</div>
              <div style={{
                fontSize: 13, color: 'var(--text-muted)',
                lineHeight: 1.6,
                background: 'var(--bg)',
                padding: '10px 14px', borderRadius: 8,
                border: '1px solid var(--border)',
              }}>{description}</div>
            </div>
          )}

          {/* Admin response section — only show if admin has acted */}
          {(assignedTo || adminNote) && (
            <div style={{
              padding: '14px 16px', borderRadius: 10,
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}>
              <div style={{
                fontSize: 11, fontWeight: 600,
                color: 'var(--indigo)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em', marginBottom: 10,
              }}>Admin Response</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* Assigned worker */}
                {assignedTo && (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--text-faint)' }}>Assigned to: </span>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{assignedTo}</span>
                  </div>
                )}
                {/* Admin note to student */}
                {adminNote && (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--text-faint)' }}>Note: </span>
                    {adminNote}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────
export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all'); // active filter tab
  const [mounted, setMounted]       = useState(false);

  useEffect(() => {
    setMounted(true);
    // TODO: Replace with real API call when backend is ready
    // axios.get('/api/complaints/mine', { withCredentials: true })
    //   .then(r => setComplaints(r.data))
    //   .catch(() => toast.error('Failed to load complaints'))
    //   .finally(() => setLoading(false));

    // Fake loading delay for now
    const t = setTimeout(() => {
      setComplaints(MOCK_COMPLAINTS);
      setLoading(false);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  // Filter complaints based on active tab
  const filtered = filter === 'all'
    ? complaints
    : complaints.filter(c => c.status === filter);

  // Count per status for filter tab badges
  const counts = {
    all:           complaints.length,
    open:          complaints.filter(c => c.status === 'open').length,
    'in-progress': complaints.filter(c => c.status === 'in-progress').length,
    resolved:      complaints.filter(c => c.status === 'resolved').length,
  };

  return (
    <div style={{
      opacity: mounted ? 1 : 0,
      transition: 'opacity 0.3s ease',
    }}>

      {/* ── Page header ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: 16,
        marginBottom: 28,
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28, fontWeight: 700,
            color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: 6,
          }}>My Complaints</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Track and manage all your reported issues.
          </p>
        </div>

        {/* Quick link to submit a new complaint */}
        <Link
          to="/new-complaint"
          className="btn btn-primary"
          style={{ flexShrink: 0 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Complaint
        </Link>
      </div>

      {/* ── Filter tabs ── */}
      {/* Each tab shows a count badge so user knows how many in each status */}
      <div style={{
        display: 'flex', gap: 6,
        marginBottom: 20, flexWrap: 'wrap',
      }}>
        {FILTERS.map(f => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 16px', borderRadius: 8,
                fontSize: 13, fontWeight: 500,
                cursor: 'pointer', border: 'none',
                transition: 'all 0.15s ease',
                // Active tab gets indigo glow, inactive is subtle
                background: active
                  ? 'linear-gradient(135deg, var(--indigo), var(--violet))'
                  : 'var(--bg-card)',
                color: active ? 'white' : 'var(--text-muted)',
                boxShadow: active ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                border: active ? 'none' : '1px solid var(--border)',
              }}
            >
              {f.label}
              {/* Count badge next to each tab label */}
              <span style={{
                fontSize: 11, fontWeight: 600,
                padding: '1px 7px', borderRadius: 20,
                background: active ? 'rgba(255,255,255,0.2)' : 'var(--bg)',
                color: active ? 'white' : 'var(--text-faint)',
              }}>
                {counts[f.value]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Complaint list ── */}
      {loading ? (
        // Skeleton loaders while data is fetching
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 11, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 13, width: '55%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 11, width: '35%' }} />
                </div>
                <div className="skeleton" style={{ height: 24, width: 80, borderRadius: 20 }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        // Empty state — no complaints found for selected filter
        <div className="card" style={{ padding: '52px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>
            {filter === 'all' ? '📭' : filter === 'resolved' ? '🎉' : '🔍'}
          </div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17, fontWeight: 600,
            color: 'var(--text)', marginBottom: 8,
          }}>
            {filter === 'all'
              ? 'No complaints yet'
              : `No ${filter} complaints`}
          </h3>
          <p style={{
            fontSize: 14, color: 'var(--text-muted)',
            marginBottom: 20, lineHeight: 1.6,
          }}>
            {filter === 'all'
              ? "You haven't reported any issues yet."
              : `You have no complaints with status "${filter}".`}
          </p>
          {filter === 'all' && (
            <Link to="/new-complaint" className="btn btn-primary">
              + Report an Issue
            </Link>
          )}
        </div>
      ) : (
        // Render complaint cards
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((complaint, i) => (
            <ComplaintCard
              key={complaint._id}
              complaint={complaint}
              index={i}
            />
          ))}
        </div>
      )}

      {/* ── Footer count ── */}
      {/* Only show when there are complaints */}
      {!loading && filtered.length > 0 && (
        <p style={{
          textAlign: 'center', marginTop: 20,
          fontSize: 12, color: 'var(--text-faint)',
        }}>
          Showing {filtered.length} of {complaints.length} complaints
        </p>
      )}

    </div>
  );
}