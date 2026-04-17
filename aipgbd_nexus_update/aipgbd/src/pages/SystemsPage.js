import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDivision } from '../i18n/DivisionContext';

export default function SystemsPage() {
  const navigate = useNavigate();
  const { setDivision } = useDivision();

  useEffect(() => {
    setDivision('systems');
    document.title = 'AIPG Systems – Enterprise Software Engineering';
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
        border: '1px solid rgba(0,229,255,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,229,255,0.04)',
      }}>
        <span style={{ color: '#00e5ff', fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}>{'</>'}</span>
      </div>

      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(0,229,255,0.4)',
          marginBottom: '0.75rem',
        }}>
          Division II — AIPG Systems
        </p>
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 4rem)',
          fontWeight: 300,
          color: '#00e5ff',
          lineHeight: 1.1,
          marginBottom: '1.2rem',
        }}>
          Enterprise<br />Software Engineering
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          color: 'rgba(240,244,255,0.5)',
          lineHeight: 1.7,
        }}>
          Production-grade React &amp; ASP.NET Core solutions. Portfolio,
          services, and case studies — coming soon.
        </p>
      </div>

      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1.6rem',
          background: 'transparent',
          border: '1px solid rgba(0,229,255,0.2)',
          borderRadius: '100px',
          color: 'rgba(0,229,255,0.5)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(0,229,255,0.5)'}
        onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)'}
      >
        ← Back to Nexus
      </button>
    </div>
  );
}
