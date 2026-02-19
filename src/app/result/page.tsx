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

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', borderTop: '8px solid var(--primary)' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Il tuo orientamento</h1>
        <div style={{ 
          fontSize: '3rem', 
          fontWeight: 900, 
          color: lean === 'SÌ' ? '#10b981' : lean === 'NO' ? '#ef4444' : '#f59e0b',
          margin: '1.5rem 0'
        }}>
          Incline: {lean}
        </div>
        <p style={{ fontSize: '1.25rem', color: 'var(--text)' }}>
          Forza: <strong>{strength}</strong>
        </p>
        <div style={{ 
          background: 'var(--bg)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius)',
          margin: '2rem 0',
          textAlign: 'left'
        }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Analisi Sintetica</h3>
          <p style={{ color: 'var(--text)', fontWeight: 600, fontSize: '1.1rem' }}>{quadrantLabel}</p>
          <p style={{ marginBottom: 0 }}>Driver principale: <strong>{motive}</strong></p>
        </div>

        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Fattori determinanti:</h3>
          {topModules.map(([name, scores]: [string, any]) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
              <span>{name.replace(/_/g, ' ').replace('A ', '').replace('B ', '').replace('C ', '').replace('D ', '')}</span>
              <span style={{ fontWeight: 600, color: (scores.yesNo > 0 ? '#10b981' : '#ef4444') }}>
                {scores.yesNo > 0 ? 'Favorevole' : 'Contrario'}
              </span>
            </div>
          ))}
        </div>

        <section style={{ textAlign: 'left', marginTop: '3rem' }}>
          <h2>Per approfondire</h2>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {sources.map((src, i) => (
              <a 
                key={i} 
                href={src.url} 
                target="_blank" 
                rel="noreferrer"
                style={{ 
                  padding: '0.75rem', 
                  background: 'var(--white)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius)',
                  fontSize: '0.85rem',
                  color: 'var(--primary)',
                  textDecoration: 'none'
                }}
              >
                {src.label} ↗
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
