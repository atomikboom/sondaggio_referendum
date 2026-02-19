'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuiz } from '@/components/QuizProvider';

export default function Home() {
  const router = useRouter();
  const { setUser } = useQuiz();
  const [formData, setFormData] = useState({
    sex: '',
    age: '',
    consent: false
  });

  const canStart = formData.sex && formData.age && formData.consent && Number(formData.age) >= 0;

  const handleStart = () => {
    if (!canStart) return;
    setUser({ sex: formData.sex, age: formData.age });
    router.push('/quiz');
  };

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Referendum Giustizia</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>Analisi neutrale della riforma costituzionale 2026</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Sesso</label>
            <select 
              value={formData.sex} 
              onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value }))}
            >
              <option value="">Seleziona...</option>
              <option value="Donna">Donna</option>
              <option value="Uomo">Uomo</option>
              <option value="Altro">Altro</option>
              <option value="Preferisco non dirlo">Preferisco non dirlo</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Età</label>
            <input 
              type="number" 
              placeholder="Inserisci la tua età" 
              value={formData.age} 
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))} 
            />
          </div>

          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="consent" 
              checked={formData.consent} 
              onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))} 
            />
            <label htmlFor="consent" style={{ fontSize: '0.9rem' }}>
              Acconsento <strong>espressamente</strong> al trattamento delle mie risposte per finalità statistiche. Le risposte possono rivelare orientamenti di voto. <Link href="/privacy" style={{ color: 'var(--primary)' }}>Maggiori informazioni</Link>
            </label>
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          disabled={!canStart}
          onClick={handleStart}
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', opacity: canStart ? 1 : 0.6 }}
        >
          Inizia il Percorso
        </button>
      </div>
    </div>
  );
}
