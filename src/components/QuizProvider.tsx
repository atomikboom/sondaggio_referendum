'use client';

import React, { createContext, useContext, useState } from 'react';
import { Answers, Interpretation, AnswerValue } from '@/scoring';
import { ScoreVector } from '@/questions';

interface QuizContextType {
  user: {
    sex: string;
    age: string;
  };
  answers: Answers;
  result: (Interpretation & { totals: ScoreVector; byModule: Record<string, ScoreVector> }) | null;
  setUser: (user: { sex: string; age: string }) => void;
  setAnswer: (questionId: string, answer: AnswerValue | "DK") => void;
  setResult: (result: (Interpretation & { totals: ScoreVector; byModule: Record<string, ScoreVector> })) => void;
  reset: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState({ sex: '', age: '' });
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<(Interpretation & { totals: ScoreVector; byModule: Record<string, ScoreVector> }) | null>(null);

  const setUser = (user: { sex: string; age: string }) => setUserState(user);
  const setAnswer = (questionId: string, answer: AnswerValue | "DK") => {
    setAnswers((prev: Answers) => ({ ...prev, [questionId]: answer }));
  };
  const reset = () => {
    setUserState({ sex: '', age: '' });
    setAnswers({});
    setResult(null);
  };

  return (
    <QuizContext.Provider value={{ user, answers, result, setUser, setAnswer, setResult, reset }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
