'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/components/QuizProvider';
import { QUESTIONS } from '@/questions';

export default function QuizPage() {
  const router = useRouter();
  const { user, answers, setAnswer, setResult } = useQuiz();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if user info is missing
  useEffect(() => {
    if (!user.sex || !user.age) {
      router.push('/');
    }
  }, [user, router]);

  const question = QUESTIONS[currentIdx];
  const progress = ((currentIdx + 1) / QUESTIONS.length) * 100;
  
  const currentAnswer = answers[question.id];

  const handleNext = async () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowHelp(false);
    } else {
      // Final submit
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            sex: user.sex, 
            age: user.age, 
            answers 
          }),
        });
        const data = await res.json();
        setResult(data);
        router.push('/result');
      } catch (err) {
        console.error('Submit error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setShowHelp(false);
    }
  };

  if (!question) return null;

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Domanda {currentIdx + 1} di {QUESTIONS.length}
          </span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
            {question.module.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <h2 style={{ fontSize: '1.25rem', lineHeight: '1.4', marginBottom: '1.5rem' }}>
          {question.text}
          <span className="help-icon" onClick={() => setShowHelp(!showHelp)}>?</span>
        </h2>

        {showHelp && (
          <div className="popover" style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.2s' }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>{question.help}</p>
            {question.legalRef && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', fontStyle: 'italic', margin: 0 }}>
                Rif: {question.legalRef}
              </p>
            )}
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          {question.kind === 'likert5' ? (
            <div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)', textAlign: 'center' }}>
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    className={`btn ${currentAnswer === val ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setAnswer(question.id, val)}
                    style={{ padding: '1rem 0.5rem', fontSize: '1.1rem' }}
                  >
                    {val}
                  </button>
                ))}
                <button
                  className={`btn ${currentAnswer === 'DK' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setAnswer(question.id, 'DK')}
                  style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                >
                  Non so
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Fortemente Contrario</span>
                <span>Neutro</span>
                <span>Fortemente Favorevole</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {question.options.map((opt) => (
                <button
                  key={opt.id}
                  className={`btn ${currentAnswer === opt.id ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setAnswer(question.id, opt.id)}
                  style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '1rem' }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleBack}
            disabled={currentIdx === 0}
            style={{ flex: 1 }}
          >
            Indietro
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleNext}
            disabled={currentAnswer === undefined || isSubmitting}
            style={{ flex: 2 }}
          >
            {isSubmitting ? 'Salvataggio...' : currentIdx === QUESTIONS.length - 1 ? 'Vedi Risultato' : 'Avanti'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
