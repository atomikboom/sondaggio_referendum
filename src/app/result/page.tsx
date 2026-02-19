'use client';

import { useRouter } from 'next/navigation';
import { useQuiz } from '@/components/QuizProvider';

export default function ResultPage() {
  const router = useRouter();
  const { result, reset } = useQuiz();

  if (!result) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <p>Caricamento risultati...</p>
          <button className="btn btn-primary" onClick={() => router.push('/')}>Torna alla Home</button>
        </div>
      </div>
    );
  }

  const { lean, strength, motive, quadrantLabel, byModule } = result;

  const topModules = Object.entries(byModule as Record<string, { yesNo: number }>)
    .sort(([, a], [, b]) => Math.abs(b.yesNo) - Math.abs(a.yesNo))
    .slice(0, 2);

  const sources = [
    { label: "Gazzetta Ufficiale - Testo di Legge", url: "https://www.gazzettaufficiale.it/" },
    { label: "Senato della Repubblica - Dossier Riforma", url: "https://www.senato.it/" },
    { label: "Camera dei Deputati - Monitoraggio", url: "https://www.camera.it/" },
    { label: "Analisi - Valutazione costituzionalisti", url: "https://www.federalismi.it/" },
    { label: "Il Post - Spiegazione Referendum", url: "https://www.ilpost.it/" },
    { label: "Open - Guida al voto", url: "https://www.open.online/" },
    { label: "AGI - Fact-checking carriere", url: "https://www.agi.it/" },
    { label: "Sole 24 Ore - Impatto economico giustizia", url: "https://www.ilsole24ore.com/" }
  ];

  const getMeterPosition = () => {
    // scale from -100 to 100
    const val = result.totals.yesNo;
    return ((val + 100) / 200) * 100;
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '6px', 
          background: lean === 'SÌ' ? '#10b981' : lean === 'NO' ? '#ef4444' : '#f59e0b' 
        }} />
        
        <h1 style={{ marginBottom: '0.5rem', marginTop: '1rem' }}>Analisi Orientamento</h1>
        
        <div style={{ margin: '3rem 0' }}>
          <div style={{ 
            fontSize: '3.5rem', 
            fontWeight: 900, 
            lineHeight: 1,
            color: lean === 'SÌ' ? '#10b981' : lean === 'NO' ? '#ef4444' : '#f59e0b',
            textShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {lean}
          </div>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            CONVINZIONE: <span style={{ color: 'var(--text)', fontWeight: 800 }}>{strength.toUpperCase()}</span>
          </p>
        </div>

        {/* Sentiment Meter */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>CONTRARIO (NO)</span>
            <span>FAVOREVOLE (SÌ)</span>
          </div>
          <div style={{ height: '12px', background: 'var(--bg)', borderRadius: '6px', position: 'relative', border: '1px solid var(--border)' }}>
            <div style={{ 
              position: 'absolute', 
              top: '-4px', 
              left: `${getMeterPosition()}%`, 
              width: '20px', 
              height: '20px', 
              background: 'var(--primary)', 
              borderRadius: '50%', 
              transform: 'translateX(-50%)',
              boxShadow: '0 0 10px var(--primary)',
              transition: 'left 1s ease-out'
            }} />
          </div>
        </div>

        <div style={{ 
          background: 'rgba(255,255,255,0.03)', 
          padding: '2rem', 
          borderRadius: 'var(--radius)',
          margin: '2rem 0',
          textAlign: 'left',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Il tuo profilo</h3>
          <p style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.3rem', margin: '0.5rem 0' }}>{quadrantLabel}</p>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.6', margin: 0 }}>Driver principale: <strong style={{ color: 'var(--primary)' }}>{motive}</strong></p>
        </div>

        <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Fattori chiave della tua scelta:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {topModules.map(([name, scores]: [string, { yesNo: number }]) => (
              <div key={name} style={{ background: 'rgba(0,0,0,0.1)', padding: '1.5rem', borderRadius: 'var(--radius)', borderLeft: `4px solid ${scores.yesNo > 0 ? '#10b981' : '#ef4444'}` }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{name.replace(/_/g, ' ').replace(/[A-D] /, '')}</div>
                <div style={{ fontWeight: 800, color: (scores.yesNo > 0 ? '#10b981' : '#ef4444') }}>
                  {scores.yesNo > 0 ? 'FAVOREVOLE' : 'CONTRARIO'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <section style={{ textAlign: 'left', marginTop: '4rem' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📖</span> Bibliografia & Approfondimenti
          </h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {sources.map((src, i) => (
              <a 
                key={i} 
                href={src.url} 
                target="_blank" 
                rel="noreferrer"
                className="card"
                style={{ 
                  padding: '1rem', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius)',
                  fontSize: '0.9rem',
                  color: 'var(--text)',
                  textDecoration: 'none',
                  transition: 'transform 0.2s, background 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <span>{src.label}</span>
                <span style={{ color: 'var(--primary)' }}>↗</span>
              </a>
            ))}
          </div>
        </section>

        <button 
          className="btn btn-secondary" 
          onClick={() => { reset(); router.push('/'); }}
          style={{ marginTop: '3rem', width: '100%' }}
        >
          Ricomincia il Quiz
        </button>
      </div>
    </div>
  );
}
