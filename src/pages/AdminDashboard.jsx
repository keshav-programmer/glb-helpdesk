import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────
// ICON MAP
// ─────────────────────────────────────────────
const ISSUE_ICONS = {
  fan: '🌀', window: '🪟', door: '🚪',
  table: '🛋️', chair: '🪑', light: '💡',
  ac: '❄️', projector: '📽️', other: '🔧',
};

// ─────────────────────────────────────────────
// MOCK DATA — replace with API later
// ─────────────────────────────────────────────
const MOCK_ALL_COMPLAINTS = [
  {
    _id: '1', ticketId: 'GLB-0001',
    category: 'hostel', issueType: 'fan',
    floor: '2', roomNumber: '204',
    status: 'open', description: 'Fan makes loud noise.',
    assignedTo: '', adminNote: '',
    createdAt: new Date('2026-03-20'),
    student: { name: 'Pavan Kumar', email: 'pavan@glbitm.ac.in' },
  },
  {
    _id: '2', ticketId: 'GLB-0002',
    category: 'classroom', issueType: 'projector',
    floor: '1', roomNumber: 'CS-101',
    status: 'in-progress', description: 'Projector not displaying.',
    assignedTo: 'Raju Electrician', adminNote: 'Part ordered.',
    createdAt: new Date('2026-03-19'),
    student: { name: 'Rahul Singh', email: 'rahul@glbitm.ac.in' },
  },
  {
    _id: '3', ticketId: 'GLB-0003',
    category: 'hostel', issueType: 'light',
    floor: '3', roomNumber: '310',
    status: 'resolved', description: '',
    assignedTo: 'Suresh Kumar', adminNote: 'Bulb replaced.',
    createdAt: new Date('2026-03-18'),
    student: { name: 'Amit Sharma', email: 'amit@glbitm.ac.in' },
  },
  {
    _id: '4', ticketId: 'GLB-0004',
    category: 'classroom', issueType: 'ac',
    floor: '2', roomNumber: 'ME-201',
    status: 'open', description: 'AC not cooling.',
    assignedTo: '', adminNote: '',
    createdAt: new Date('2026-03-17'),
    student: { name: 'Priya Verma', email: 'priya@glbitm.ac.in' },
  },
  {
    _id: '5', ticketId: 'GLB-0005',
    category: 'hostel', issueType: 'door',
    floor: '1', roomNumber: '105',
    status: 'open', description: 'Door lock broken.',
    assignedTo: '', adminNote: '',
    createdAt: new Date('2026-03-16'),
    student: { name: 'Rohit Gupta', email: 'rohit@glbitm.ac.in' },
  },
];

// ─────────────────────────────────────────────
// STATUS BADGE
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
// UPDATE MODAL
// Opens when admin clicks Update on a complaint
// ─────────────────────────────────────────────
function UpdateModal({ complaint, onClose, onSave }) {
  const [form, setForm] = useState({
    status:     complaint.status,
    assignedTo: complaint.assignedTo || '',
    adminNote:  complaint.adminNote  || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: replace with real API call
      // await axios.patch(`/api/admin/complaints/${complaint._id}`, form, { withCredentials: true });
      await new Promise(r => setTimeout(r, 800));
      onSave(complaint._id, form);
      toast.success(`${complaint.ticketId} updated! Student notified.`);
      onClose();
    } catch {
      toast.error('Failed to update complaint.');
    } finally {
      setSaving(false);
    }
  };

  return (
    // Backdrop — clicking outside closes modal
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 20,
      }}
    >
      <div className="card" style={{
        width: '100%', maxWidth: 500,
        padding: 28,
        animation: 'fadeUp 0.25s ease both',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: 20,
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18, fontWeight: 700,
              color: 'var(--text)', marginBottom: 4,
            }}>Update Complaint</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {complaint.ticketId} — {complaint.issueType} in {complaint.category},
              Floor {complaint.floor}, Room {complaint.roomNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--text-faint)',
              fontSize: 20, lineHeight: 1, padding: 4,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}
          >✕</button>
        </div>

        {/* Student info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 10,
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          marginBottom: 20,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--indigo), var(--violet))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 600, color: 'white',
          }}>
            {complaint.student.name[0]}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
              {complaint.student.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>
              {complaint.student.email}
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Status selector */}
        <div className="form-group">
          <label>Update Status</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {[
              { value: 'open',        label: 'Open',        color: 'var(--warning)' },
              { value: 'in-progress', label: 'In Progress', color: 'var(--info)'    },
              { value: 'resolved',    label: 'Resolved',    color: 'var(--success)' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set('status', opt.value)}
                style={{
                  padding: '9px 8px', borderRadius: 8,
                  cursor: 'pointer', fontSize: 12,
                  fontWeight: 500, border: 'none',
                  transition: 'all 0.15s ease',
                  background: form.status === opt.value
                    ? `rgba(${
                        opt.value === 'open'        ? '245,158,11' :
                        opt.value === 'in-progress' ? '129,140,248' :
                                                      '16,185,129'
                      },0.15)`
                    : 'var(--bg)',
                  color: form.status === opt.value ? opt.color : 'var(--text-muted)',
                  outline: `2px solid ${form.status === opt.value ? opt.color : 'transparent'}`,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Assign worker */}
        <div className="form-group">
          <label>Assign To (worker name)</label>
          <input
            type="text"
            placeholder="e.g. Raju Electrician"
            value={form.assignedTo}
            onChange={e => set('assignedTo', e.target.value)}
          />
        </div>

        {/* Note to student */}
        <div className="form-group">
          <label>Note to Student</label>
          <textarea
            rows={3}
            placeholder="e.g. Will be fixed by tomorrow morning..."
            value={form.adminNote}
            onChange={e => set('adminNote', e.target.value)}
            style={{ resize: 'vertical', minHeight: 80 }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
            style={{ flex: 2 }}
          >
            {saving ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 13, height: 13,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }}/>
                Saving...
              </span>
            ) : '✓ Save & Notify Student'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPLAINT ROW — separate component so each
// row can have its own expanded state safely
// This fixes the "can't use useState in .map()"
// problem — each row is its own component
// ─────────────────────────────────────────────
function ComplaintRow({ complaint, index, onUpdate }) {
  // Each row manages its own expand state
  const [expanded, setExpanded] = useState(false);
  const c = complaint;

  return (
    <div
      className="card"
      style={{
        overflow: 'hidden',
        animation: `fadeUp 0.35s ease both ${index * 0.06}s`,
        transition: 'border-color 0.2s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >

      {/* ── Main row — always visible ── */}
      <div style={{
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>

        {/* Issue icon */}
        <div style={{
          width: 42, height: 42, borderRadius: 11, flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
          border: '1px solid rgba(99,102,241,0.2)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 20,
        }}>
          {ISSUE_ICONS[c.issueType] || '🔧'}
        </div>

        {/* Complaint info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14, fontWeight: 500,
            color: 'var(--text)', textTransform: 'capitalize', marginBottom: 4,
          }}>
            {c.issueType} — {c.category}, Floor {c.floor}, Room {c.roomNumber}
          </div>
          <div style={{
            fontSize: 12, color: 'var(--text-faint)',
            display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
          }}>
            <span>{c.ticketId}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{ color: 'var(--text-muted)' }}>{c.student.name}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>
              {new Date(c.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short',
              })}
            </span>
            {/* Show assigned worker if set */}
            {c.assignedTo && (
              <>
                <span style={{ opacity: 0.4 }}>·</span>
                <span style={{ color: 'var(--success)' }}>
                  Assigned: {c.assignedTo}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right — badge + update + expand */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 8, flexShrink: 0,
        }}>
          <StatusBadge status={c.status} />

          {/* Update button — opens modal */}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onUpdate(c)}
            style={{ fontSize: 12 }}
          >
            Update
          </button>

          {/* Expand/collapse toggle */}
          <button
            onClick={() => setExpanded(prev => !prev)}
            style={{
              width: 28, height: 28, borderRadius: 7,
              background: expanded ? 'var(--bg-hover)' : 'transparent',
              border: `1px solid ${expanded ? 'var(--border-hover)' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer',
              color: expanded ? 'var(--text)' : 'var(--text-faint)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-hover)';
              e.currentTarget.style.color = 'var(--text)';
            }}
            onMouseLeave={e => {
              if (!expanded) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-faint)';
              }
            }}
          >
            {/* Arrow rotates when expanded */}
            <svg
              width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round"
              style={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s ease',
              }}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Expanded details — only shown when toggled ── */}
      {expanded && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '18px 20px',
          background: 'rgba(255,255,255,0.015)',
          animation: 'fadeUp 0.2s ease both',
        }}>

          {/* 3-column detail grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16, marginBottom: 16,
          }}>
            {[
              { label: 'Ticket ID',  value: c.ticketId   },
              { label: 'Category',   value: c.category   },
              { label: 'Location',   value: `Floor ${c.floor}, Room ${c.roomNumber}` },
              { label: 'Issue Type', value: c.issueType  },
              { label: 'Student',    value: c.student.name  },
              { label: 'Email',      value: c.student.email },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{
                  fontSize: 10, fontWeight: 500,
                  color: 'var(--text-faint)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em', marginBottom: 4,
                }}>{label}</div>
                <div style={{
                  fontSize: 13, color: 'var(--text)',
                  textTransform: 'capitalize',
                }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Student description — only if provided */}
          {c.description && (
            <div style={{ marginBottom: 14 }}>
              <div style={{
                fontSize: 10, fontWeight: 500,
                color: 'var(--text-faint)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em', marginBottom: 6,
              }}>Student Description</div>
              <div style={{
                fontSize: 13, color: 'var(--text-muted)',
                lineHeight: 1.6, padding: '10px 14px',
                background: 'var(--bg)', borderRadius: 8,
                border: '1px solid var(--border)',
              }}>{c.description}</div>
            </div>
          )}

          {/* Admin response — only if admin has acted */}
          {(c.assignedTo || c.adminNote) && (
            <div style={{
              padding: '12px 16px', borderRadius: 10,
              background: 'rgba(99,102,241,0.07)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}>
              <div style={{
                fontSize: 10, fontWeight: 600,
                color: 'var(--indigo)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em', marginBottom: 8,
              }}>Admin Response</div>
              {c.assignedTo && (
                <div style={{
                  fontSize: 13, color: 'var(--text-muted)', marginBottom: 4,
                }}>
                  <span style={{ color: 'var(--text-faint)' }}>Assigned to: </span>
                  <span style={{ color: 'var(--success)', fontWeight: 500 }}>
                    {c.assignedTo}
                  </span>
                </div>
              )}
              {c.adminNote && (
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--text-faint)' }}>Note: </span>
                  {c.adminNote}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN ADMIN DASHBOARD
// ─────────────────────────────────────────────
export default function AdminDashboard() {
  const [complaints, setComplaints]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [mounted, setMounted]               = useState(false);
  const [filterStatus,   setFilterStatus]   = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Which complaint is open in the update modal (null = closed)
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setMounted(true);
    // TODO: Replace with real API call
    // axios.get('/api/admin/complaints', { withCredentials: true })
    //   .then(r => setComplaints(r.data))
    //   .catch(() => toast.error('Failed to load'))
    //   .finally(() => setLoading(false));
    const t = setTimeout(() => {
      setComplaints(MOCK_ALL_COMPLAINTS);
      setLoading(false);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  // Update a complaint locally after modal saves
  const handleSave = (id, updatedFields) => {
    setComplaints(prev =>
      prev.map(c => c._id === id ? { ...c, ...updatedFields } : c)
    );
  };

  // Compute stats
  const stats = {
    total:      complaints.length,
    open:       complaints.filter(c => c.status === 'open').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved:   complaints.filter(c => c.status === 'resolved').length,
  };

  // Apply both filters
  const filtered = complaints.filter(c => {
    const statusMatch   = filterStatus   === 'all' || c.status   === filterStatus;
    const categoryMatch = filterCategory === 'all' || c.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.3s ease' }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 20, marginBottom: 10,
          background: 'rgba(139,92,246,0.12)',
          border: '1px solid rgba(139,92,246,0.25)',
        }}>
          {/* Pulsing purple dot */}
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#a78bfa',
            boxShadow: '0 0 0 0 rgba(167,139,250,0.4)',
            animation: 'pulse-purple 1.5s infinite',
          }}/>
          <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600 }}>
            ADMIN PANEL
          </span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28, fontWeight: 700,
          color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: 6,
        }}>Admin Dashboard</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Manage and resolve all campus complaints.
        </p>
      </div>

      {/* ── Stats row ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12, marginBottom: 28,
      }}>
        {[
          { label: 'Total',       value: stats.total,      color: 'var(--info)',    bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.2)' },
          { label: 'Open',        value: stats.open,       color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)'  },
          { label: 'In Progress', value: stats.inProgress, color: '#a78bfa',        bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.2)'  },
          { label: 'Resolved',    value: stats.resolved,   color: 'var(--success)', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)'  },
        ].map((s, i) => (
          <div key={s.label} style={{
            padding: '20px 22px',
            background: s.bg,
            border: `1px solid ${s.border}`,
            borderRadius: 14,
            animation: `fadeUp 0.4s ease both ${i * 0.07}s`,
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {loading ? (
              <>
                <div className="skeleton" style={{ height: 32, width: 48, marginBottom: 8 }}/>
                <div className="skeleton" style={{ height: 12, width: 64 }}/>
              </>
            ) : (
              <>
                <div style={{
                  fontSize: 30, fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  color: s.color, marginBottom: 4,
                }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                  {s.label}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{
        display: 'flex', gap: 10,
        marginBottom: 18, flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        {/* Status filters */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'open', 'in-progress', 'resolved'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: '7px 14px', borderRadius: 8,
                fontSize: 12, fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: filterStatus === s
                  ? 'linear-gradient(135deg, var(--indigo), var(--violet))'
                  : 'var(--bg-card)',
                color: filterStatus === s ? 'white' : 'var(--text-muted)',
                boxShadow: filterStatus === s ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                border: filterStatus === s ? 'none' : '1px solid var(--border)',
                textTransform: 'capitalize',
              }}
            >
              {s === 'all' ? 'All Status' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'var(--border)' }}/>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'hostel', 'classroom'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '7px 14px', borderRadius: 8,
                fontSize: 12, fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: filterCategory === cat ? 'var(--bg-hover)' : 'var(--bg-card)',
                color: filterCategory === cat ? 'var(--text)' : 'var(--text-muted)',
                border: filterCategory === cat
                  ? '1px solid var(--border-hover)'
                  : '1px solid var(--border)',
                textTransform: 'capitalize',
              }}
            >
              {cat === 'all' ? 'All Locations' : cat}
            </button>
          ))}
        </div>

        {/* Result count */}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-faint)' }}>
          {filtered.length} complaint{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Complaint list ── */}
      {loading ? (
        // Skeleton loaders while fetching
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div className="skeleton" style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0 }}/>
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 13, width: '45%', marginBottom: 8 }}/>
                  <div className="skeleton" style={{ height: 11, width: '30%' }}/>
                </div>
                <div className="skeleton" style={{ height: 24, width: 80, borderRadius: 20 }}/>
                <div className="skeleton" style={{ height: 32, width: 80, borderRadius: 8 }}/>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        // Empty state
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎉</div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17, fontWeight: 600,
            color: 'var(--text)', marginBottom: 8,
          }}>No complaints found</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Try changing the filters above.
          </p>
        </div>
      ) : (
        // Each row is a separate component so it can have its own expanded state
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((complaint, i) => (
            <ComplaintRow
              key={complaint._id}
              complaint={complaint}
              index={i}
              onUpdate={setSelected}
            />
          ))}
        </div>
      )}

      {/* ── Update modal — shown when a complaint is selected ── */}
      {selected && (
        <UpdateModal
          complaint={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
        />
      )}

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes pulse-purple {
          0%   { box-shadow: 0 0 0 0 rgba(167,139,250,0.5); }
          70%  { box-shadow: 0 0 0 6px rgba(167,139,250,0); }
          100% { box-shadow: 0 0 0 0 rgba(167,139,250,0); }
        }
      `}</style>
    </div>
  );
}