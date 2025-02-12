import { useState, useEffect } from 'react';
import { AnsweredQuestions } from '../types';

export const useAnsweredQuestions = () => {
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestions>(() => {
    const saved = localStorage.getItem("answeredQuestions");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("answeredQuestions", JSON.stringify(answeredQuestions));
  }, [answeredQuestions]);

  const toggleAnswered = (id: string) => {
    setAnsweredQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const resetAllAnswers = () => {
    if (window.confirm("Czy na pewno chcesz usunąć wszystkie odhaczone?")) {
      setAnsweredQuestions({});
    }
  };

  return { answeredQuestions, toggleAnswered, resetAllAnswers };
};
