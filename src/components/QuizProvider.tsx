'use client';

import React, { createContext, useContext, useState } from 'react';

interface QuizContextType {
  user: {
    sex: string;
    age: string;
  };
  answers: Record<string, any>;
  result: any;
  setUser: (user: { sex: string; age: string }) => void;
  setAnswer: (questionId: string, answer: any) => void;
  setResult: (result: any) => void;
  reset: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState({ sex: '', age: '' });
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);

  const setUser = (user: { sex: string; age: string }) => setUserState(user);
  const setAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
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
