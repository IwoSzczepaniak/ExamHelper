import { useState, useEffect } from 'react';
import { QuestionNotes } from '../types';

export const useQuestionNotes = () => {
  const [notes, setNotes] = useState<QuestionNotes>(() => {
    const saved = localStorage.getItem("questionNotes");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("questionNotes", JSON.stringify(notes));
  }, [notes]);

  return { notes, setNotes };
}; 