'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-token': password }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        setError('Password errata o non autorizzato.');
      }
    } catch (err) {
      setError('Errore di connessione.');
    } finally {
      setLoading(false);
    }
  };

  if (!stats) {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: '400px', margin: '100px auto' }}>
          <h1>Area Admin</h1>
          <p>Inserisci il token di accesso per vedere le statistiche.</p>
          <input 
            type="password" 
            placeholder="Admin Token" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            onClick={fetchStats}
            disabled={loading}
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
          {error && <p style={{ color: 'red', marginTop: '1rem', fontSize: '0.8rem' }}>{error}</p>}
        </div>
      </div>
    );
  }

  const getPercentage = (count: number) => {
    if (!stats?.totalCount) return '0%';
    return Math.round((count / stats.totalCount) * 100) + '%';
  };

  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Dashboard Amministratore</h1>
          <button className="btn btn-secondary" onClick={() => setStats(null)}>Logout</button>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Totale Risposte</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem' }}>{stats.totalCount}</div>
          </div>
          {['SÌ', 'NO', 'INCERTO'].map(lean => {
            const item = stats.leanCounts.find((i: any) => i.lean === lean);
            const count = item?._count.lean || 0;
            return (
              <div key={lean} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Incline {lean}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{count}</div>
                  <div style={{ fontSize: '1.2rem', color: 'var(--primary)', opacity: 0.8 }}>({getPercentage(count)})</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <section className="card" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Distribuzione Sesso</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '0.75rem' }}>Sesso</th>
                  <th style={{ padding: '0.75rem' }}>N°</th>
                  <th style={{ padding: '0.75rem' }}>%</th>
                </tr>
              </thead>
              <tbody>
                {stats.sexBreakdown.map((item: any) => (
                  <tr key={item.sex} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem' }}>{item.sex}</td>
                    <td style={{ padding: '0.75rem' }}>{item._count.sex}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--primary)' }}>{getPercentage(item._count.sex)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="card" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Distribuzione Età</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '0.75rem' }}>Fascia</th>
                  <th style={{ padding: '0.75rem' }}>N°</th>
                  <th style={{ padding: '0.75rem' }}>%</th>
                </tr>
              </thead>
              <tbody>
                {stats.ageBreakdown.map((item: any) => (
                  <tr key={item.ageBand} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem' }}>{item.ageBand}</td>
                    <td style={{ padding: '0.75rem' }}>{item._count.ageBand}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--primary)' }}>{getPercentage(item._count.ageBand)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <section className="card" style={{ background: 'rgba(0,0,0,0.1)', overflowX: 'auto' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Ultime 100 Risposte</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '1rem' }}>Data</th>
                <th style={{ padding: '1rem' }}>Sesso</th>
                <th style={{ padding: '1rem' }}>Età</th>
                <th style={{ padding: '1rem' }}>Incline</th>
                <th style={{ padding: '1rem' }}>Forza</th>
                <th style={{ padding: '1rem' }}>Punteggi (S/N, Acc)</th>
              </tr>
            </thead>
            <tbody>
              {stats.responses.map((resp: any) => (
                <tr key={resp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>{new Date(resp.createdAt).toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>{resp.sex}</td>
                  <td style={{ padding: '1rem' }}>{resp.ageBand}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      color: resp.lean === 'SÌ' ? '#4ade80' : resp.lean === 'NO' ? '#f87171' : '#94a3b8',
                      fontWeight: 700
                    }}>{resp.lean}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>{resp.strength}</td>
                  <td style={{ padding: '1rem' }}>{resp.scoreYesNo} / {resp.scoreAccountability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
