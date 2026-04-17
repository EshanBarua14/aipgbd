const STACK = [
  {
    layer: 'Frontend',
    color: '#00E5FF',
    items: [
      { name: 'React 18', desc: 'Component-based UI with hooks and concurrent features', docs: 'https://react.dev' },
      { name: 'Vite', desc: 'Sub-second HMR build tool for lightning-fast development', docs: 'https://vitejs.dev' },
      { name: 'Tailwind CSS', desc: 'Utility-first CSS for rapid, consistent styling', docs: 'https://tailwindcss.com' },
    ],
  },
  {
    layer: 'Backend',
    color: '#9B59FF',
    items: [
      { name: 'ASP.NET Core 9.0', desc: 'High-performance C# API with SignalR real-time layer', docs: 'https://learn.microsoft.com/aspnet/core' },
      { name: 'PostgreSQL / pgvector', desc: 'Production database with vector similarity for prompt matching', docs: 'https://github.com/pgvector/pgvector' },
      { name: 'SignalR', desc: 'WebSocket hub for real-time project status streaming', docs: 'https://learn.microsoft.com/aspnet/signalr' },
    ],
  },
  {
    layer: 'AI Production',
    color: '#E040FB',
    items: [
      { name: 'Gemini 1.5 Pro', desc: 'Visual anchor generation. 8K hyper-realistic base images.', docs: 'https://ai.google.dev' },
      { name: 'Grok / Veo + Flux.1 Pro', desc: '30-second cinematic motion extension. Anchor-and-extend method.', docs: 'https://x.ai' },
      { name: 'Suno v4', desc: 'Original brand score composition. Mastered to broadcast standards.', docs: 'https://suno.com' },
      { name: 'ElevenLabs', desc: 'Voice cloning and multilingual voiceover. Bangla + English.', docs: 'https://elevenlabs.io' },
      { name: 'Claude (Anthropic)', desc: 'Creative direction, prompt engineering, and code generation.', docs: 'https://docs.anthropic.com' },
    ],
  },
  {
    layer: 'Infrastructure',
    color: '#F59E0B',
    items: [
      { name: 'Vercel / Netlify', desc: 'Zero-config frontend deployment with global CDN', docs: 'https://vercel.com' },
      { name: 'AES-256 Encryption', desc: 'Asset Vault file encryption for secure client delivery', docs: 'https://en.wikipedia.org/wiki/Advanced_Encryption_Standard' },
      { name: 'localStorage / IndexedDB', desc: 'Client-side persistence for admin panel and user state', docs: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API' },
    ],
  },
];

export default function TechStack() {
  return (
    <section id="tech" className="section tech">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-badge"><span className="t-label">Tech Stack</span></div>
          <h2 className="t-heading" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', marginBottom: '0.75rem' }}>
            Production-grade<br /><span className="grad-text">infrastructure.</span>
          </h2>
          <p className="t-body" style={{ maxWidth: '520px', fontSize: '0.9rem' }}>
            Every tool in the stack is production-tier, commercially licensed, and battle-tested.
            No free tiers. No watermarks. No excuses.
          </p>
        </div>

        <div className="tech__grid">
          {STACK.map((layer, li) => (
            <div key={li} className={`tech-layer glow-card reveal reveal-delay-${li+1}`} style={{ '--layer-color': layer.color }}>
              <div className="tech-layer__header">
                <div className="tech-layer__dot" />
                <span className="t-label" style={{ color: layer.color }}>{layer.layer}</span>
              </div>
              <div className="tech-layer__items">
                {layer.items.map((item, ii) => (
                  <a key={ii} href={item.docs} target="_blank" rel="noreferrer" className="tech-item" data-hover>
                    <div className="tech-item__name">{item.name}</div>
                    <div className="tech-item__desc">{item.desc}</div>
                    <div className="tech-item__arrow">↗</div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Verify Tech footer */}
        <div className="tech__footer reveal">
          <div className="tech__footer-inner glow-card">
            <div className="tech__footer-left">
              <p className="t-label" style={{ color: 'var(--text-tertiary)', marginBottom: '0.35rem' }}>Technical Documentation</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Every tool listed above links to its official API documentation. All subscriptions are commercial-tier — no watermarks, full rights.
              </p>
            </div>
            <div className="tech__footer-actions">
              <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="btn-ghost" data-hover style={{ fontSize: '0.75rem', padding: '0.7rem 1.25rem' }}>
                <span>🔍 Verify Tech</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
              <a href="https://docs.anthropic.com" target="_blank" rel="noreferrer" className="btn-primary" data-hover style={{ fontSize: '0.75rem', padding: '0.7rem 1.25rem' }}>
                <span>Claude API Docs</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .tech__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
        .tech-layer { padding: 2rem; }
        .tech-layer__header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
        .tech-layer__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--layer-color); box-shadow: 0 0 8px var(--layer-color); flex-shrink: 0; }
        .tech-layer__items { display: flex; flex-direction: column; gap: 0.75rem; }
        .tech-item {
          display: flex; align-items: flex-start; gap: 0.75rem;
          padding: 0.875rem; background: var(--bg-3); border: 1px solid var(--border);
          border-radius: 8px; text-decoration: none; transition: all 0.2s;
          position: relative;
        }
        .tech-item:hover { border-color: var(--layer-color); background: var(--surface); }
        .tech-item__name { font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 0.88rem; color: var(--text-primary); margin-bottom: 0.2rem; flex: 1; }
        .tech-item__desc { font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5; flex: 1; }
        .tech-item__arrow { font-size: 0.75rem; color: var(--text-tertiary); flex-shrink: 0; transition: color 0.2s; }
        .tech-item:hover .tech-item__arrow { color: var(--layer-color); }
        .tech__footer { }
        .tech__footer-inner { padding: 1.5rem 2rem; display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap; }
        .tech__footer-left { flex: 1; }
        .tech__footer-actions { display: flex; gap: 0.75rem; flex-shrink: 0; flex-wrap: wrap; }
        @media (max-width: 700px) { .tech__grid { grid-template-columns: 1fr; } .tech__footer-inner { flex-direction: column; } }
      `}</style>
    </section>
  );
}
