import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDivision } from '../i18n/DivisionContext';

export default function StudiosPage() {
  const navigate = useNavigate();
  const { setDivision } = useDivision();

  useEffect(() => {
    setDivision('studios');
    document.title = 'AIPG Studios – Cinematic AI Production';
  }, [setDivision]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-0)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      fontFamily: 'var(--font-display)',
    }}>
      <div style={{
        width: 56, height: 56,
        borderRadius: '50%',
        border: '1px solid rgba(201,168,76,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(201,168,76,0.05)',
      }}>
        <span style={{ color: '#C9A84C', fontSize: '1.2rem' }}>◈</span>
      </div>

      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.5)',
          marginBottom: '0.75rem',
        }}>
          Division I — AIPG Studios
        </p>
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 4rem)',
          fontWeight: 300,
          color: '#C9A84C',
          lineHeight: 1.1,
          marginBottom: '1.2rem',
        }}>
          Cinematic AI<br />Production
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          color: 'rgba(240,244,255,0.5)',
          lineHeight: 1.7,
        }}>
          High-fidelity AI video production studio. Portfolio, services,
          and client work — coming soon.
        </p>
      </div>

      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1.6rem',
          background: 'transparent',
          border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: '100px',
          color: 'rgba(201,168,76,0.6)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'}
        onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'}
      >
        ← Back to Nexus
      </button>
    </div>
  );
}
