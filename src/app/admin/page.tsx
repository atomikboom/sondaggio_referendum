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

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Statistiche Aggregate</h1>
          <span className="btn btn-secondary" onClick={() => setStats(null)}>Logout</span>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Totale Risposte</div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalCount}</div>
          </div>
          {stats.leanCounts.map((item: any) => (
            <div key={item.lean} style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.lean}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>{item._count.lean}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <section>
            <h2>Breakdown Sesso</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '0.5rem' }}>Sesso</th>
                  <th style={{ padding: '0.5rem' }}>Conteggio</th>
                </tr>
              </thead>
              <tbody>
                {stats.sexBreakdown.map((item: any) => (
                  <tr key={item.sex} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem' }}>{item.sex}</td>
                    <td style={{ padding: '0.5rem' }}>{item._count.sex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h2>Breakdown Età</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '0.5rem' }}>Fascia</th>
                  <th style={{ padding: '0.5rem' }}>Conteggio</th>
                </tr>
              </thead>
              <tbody>
                {stats.ageBreakdown.map((item: any) => (
                  <tr key={item.ageBand} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem' }}>{item.ageBand}</td>
                    <td style={{ padding: '0.5rem' }}>{item._count.ageBand}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
}
