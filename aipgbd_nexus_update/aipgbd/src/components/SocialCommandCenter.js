import { useState, useEffect, useCallback } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PLATFORMS = [
  { key: 'facebook',  bit: 1,  label: 'Facebook',  color: '#1877f2', icon: '𝕗' },
  { key: 'instagram', bit: 2,  label: 'Instagram', color: '#e1306c', icon: '◉' },
  { key: 'youtube',   bit: 4,  label: 'YouTube',   color: '#ff0000', icon: '▶' },
  { key: 'linkedin',  bit: 8,  label: 'LinkedIn',  color: '#0077b5', icon: 'in' },
];

const STATUS_TABS = ['All', 'Draft', 'Scheduled', 'Published', 'Failed'];

const statusColor = {
  Draft:     'rgba(240,244,255,0.25)',
  Scheduled: '#9b59ff',
  Published: '#00ffa3',
  Failed:    '#e040fb',
};

function PlatformBadge({ platforms }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {PLATFORMS.map(p => {
        const active = (platforms & p.bit) !== 0;
        return (
          <span key={p.key} style={{
            fontSize: '0.6rem',
            padding: '2px 7px',
            borderRadius: 100,
            background: active ? p.color + '22' : 'rgba(255,255,255,0.04)',
            color: active ? p.color : 'rgba(255,255,255,0.2)',
            border: `1px solid ${active ? p.color + '55' : 'rgba(255,255,255,0.07)'}`,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.1em',
          }}>
            {p.label}
          </span>
        );
      })}
    </div>
  );
}

function ComposeModal({ onClose, onSaved, divisionId }) {
  const [caption,     setCaption]     = useState('');
  const [mediaUrl,    setMediaUrl]    = useState('');
  const [mediaType,   setMediaType]   = useState('image');
  const [platforms,   setPlatforms]   = useState(0);
  const [scheduledAt, setScheduledAt] = useState('');
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState('');

  const togglePlatform = (bit) =>
    setPlatforms(p => (p & bit) ? p ^ bit : p | bit);

  const handleSubmit = async () => {
    if (!caption.trim())         return setError('Caption is required.');
    if (platforms === 0)         return setError('Select at least one platform.');
    setSaving(true); setError('');
    try {
      const body = {
        divisionId,
        caption,
        mediaUrl,
        mediaType,
        platforms,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      };
      const res = await fetch(`${API}/social/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      onSaved();
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const overlay = {
    position: 'fixed', inset: 0, zIndex: 900,
    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
  const modal = {
    background: 'var(--bg-1)', border: '1px solid var(--border)',
    borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 540,
    display: 'flex', flexDirection: 'column', gap: '1.2rem',
  };
  const label = { fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6, display: 'block' };
  const input = { width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.6rem 0.9rem', color: 'var(--text-0)', fontFamily: 'var(--font-body)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text-0)', fontWeight: 300 }}>
            New Post
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>

        <div>
          <span style={label}>Caption</span>
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            rows={4}
            style={{ ...input, resize: 'vertical' }}
            placeholder="Write your post caption…"
          />
        </div>

        <div>
          <span style={label}>Media URL (S3 / Azure / CDN link)</span>
          <input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} style={input} placeholder="https://cdn.example.com/video.mp4" />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <span style={label}>Media Type</span>
            <select value={mediaType} onChange={e => setMediaType(e.target.value)} style={input}>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <span style={label}>Schedule (optional)</span>
            <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} style={input} />
          </div>
        </div>

        <div>
          <span style={label}>Platforms</span>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {PLATFORMS.map(p => {
              const on = (platforms & p.bit) !== 0;
              return (
                <button
                  key={p.key}
                  onClick={() => togglePlatform(p.bit)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 100,
                    border: `1px solid ${on ? p.color : 'rgba(255,255,255,0.1)'}`,
                    background: on ? p.color + '18' : 'transparent',
                    color: on ? p.color : 'rgba(255,255,255,0.35)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {error && <p style={{ color: '#e040fb', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{error}</p>}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '0.55rem 1.4rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', cursor: 'pointer' }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{ padding: '0.55rem 1.4rem', background: 'var(--cyan)', border: 'none', borderRadius: 8, color: '#000', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', fontWeight: 700, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving…' : scheduledAt ? '⏱ Schedule' : '🚀 Publish Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SocialCommandCenter({ divisionId = 1 }) {
  const [posts,     setPosts]     = useState([]);
  const [tab,       setTab]       = useState('All');
  const [loading,   setLoading]   = useState(true);
  const [compose,   setCompose]   = useState(false);
  const [publishing, setPublishing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/social/queue?divisionId=${divisionId}`);
      const data = await res.json();
      setPosts(data);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [divisionId]);

  useEffect(() => { load(); }, [load]);

  const handlePublishNow = async (id) => {
    if (!window.confirm('Publish this post immediately?')) return;
    setPublishing(id);
    try {
      await fetch(`${API}/social/${id}/publish-now`, { method: 'POST' });
      await load();
    } finally {
      setPublishing(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await fetch(`${API}/social/${id}`, { method: 'DELETE' });
    await load();
  };

  const filtered = tab === 'All' ? posts : posts.filter(p => p.status === tab);

  const card = {
    background: 'var(--bg-1)', border: '1px solid var(--border)',
    borderRadius: 12, padding: '1.1rem 1.2rem',
    display: 'flex', flexDirection: 'column', gap: '0.7rem',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 300, color: 'var(--text-0)', marginBottom: 4 }}>
            Social Command Center
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {posts.length} posts · Facebook · Instagram · YouTube · LinkedIn
          </p>
        </div>
        <button
          onClick={() => setCompose(true)}
          style={{
            padding: '0.6rem 1.4rem',
            background: 'var(--cyan)',
            border: 'none', borderRadius: 8,
            color: '#000', fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem', letterSpacing: '0.12em',
            fontWeight: 700, cursor: 'pointer',
          }}
        >
          + New Post
        </button>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {STATUS_TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '0.35rem 1rem',
              borderRadius: 100,
              border: `1px solid ${tab === t ? 'var(--border-active)' : 'var(--border)'}`,
              background: tab === t ? 'var(--cyan-dim)' : 'transparent',
              color: tab === t ? 'var(--cyan)' : 'var(--text-3)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Post list */}
      {loading ? (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-3)' }}>Loading queue…</p>
      ) : filtered.length === 0 ? (
        <div style={{ ...card, alignItems: 'center', padding: '3rem', color: 'var(--text-3)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>No posts in this category.</p>
        </div>
      ) : (
        filtered.map(post => (
          <div key={post.id} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-1)', lineHeight: 1.55, flex: 1 }}>
                {post.caption.length > 200 ? post.caption.slice(0, 200) + '…' : post.caption}
              </p>
              <span style={{
                flexShrink: 0,
                padding: '3px 10px',
                borderRadius: 100,
                fontSize: '0.6rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.1em',
                color: statusColor[post.status] || 'var(--text-3)',
                border: `1px solid ${statusColor[post.status] || 'rgba(255,255,255,0.08)'}33`,
                background: `${statusColor[post.status] || 'rgba(255,255,255,0.05)'}11`,
              }}>
                {post.status}
              </span>
            </div>

            <PlatformBadge platforms={post.platforms} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-3)' }}>
                {post.scheduledAt
                  ? `⏱ ${new Date(post.scheduledAt).toLocaleString()}`
                  : post.publishedAt
                    ? `✓ ${new Date(post.publishedAt).toLocaleString()}`
                    : `Created ${new Date(post.createdAt).toLocaleDateString()}`}
              </span>

              <div style={{ display: 'flex', gap: 8 }}>
                {(post.status === 'Draft' || post.status === 'Scheduled') && (
                  <button
                    onClick={() => handlePublishNow(post.id)}
                    disabled={publishing === post.id}
                    style={{
                      padding: '0.35rem 0.9rem',
                      background: 'transparent',
                      border: '1px solid rgba(0,255,163,0.3)',
                      borderRadius: 6,
                      color: '#00ffa3',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      cursor: 'pointer',
                    }}
                  >
                    {publishing === post.id ? '…' : '🚀 Publish Now'}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(post.id)}
                  style={{
                    padding: '0.35rem 0.9rem',
                    background: 'transparent',
                    border: '1px solid rgba(224,64,251,0.2)',
                    borderRadius: 6,
                    color: 'rgba(224,64,251,0.6)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            {post.errorDetails && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#e040fb', background: 'rgba(224,64,251,0.06)', padding: '0.5rem 0.8rem', borderRadius: 6 }}>
                ⚠ {post.errorDetails}
              </p>
            )}
          </div>
        ))
      )}

      {compose && (
        <ComposeModal
          divisionId={divisionId}
          onClose={() => setCompose(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}
