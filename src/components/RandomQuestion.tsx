import { useState, useMemo, useEffect } from "react";
import { Questions, AnsweredQuestions } from "../types";

interface RandomQuestionModalProps {
  questions: Questions;
  answeredQuestions: AnsweredQuestions;
  onClose: () => void;
  onSelectQuestion: (id: string) => void;
  filters: {
    semesters: string[];
    subjects: string[];
  };
  onFiltersChange: (filters: {
    selectedSemester: string;
    selectedSubject: string;
    onlyAnswered: boolean;
  }) => void;
}

export function RandomQuestion({
  questions,
  answeredQuestions,
  onClose,
  onSelectQuestion,
  filters,
  onFiltersChange,
}: RandomQuestionModalProps) {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [onlyAnswered, setOnlyAnswered] = useState(false);

  const availableSubjects = useMemo(() => {
    const subjects = new Set<string>();
    Object.values(questions).forEach((q) => {
      if (!selectedSemester || q.semester === selectedSemester) {
        subjects.add(q.subject);
      }
    });
    return Array.from(subjects).sort();
  }, [questions, selectedSemester]);

  useEffect(() => {
    setSelectedSubject("");
  }, [selectedSemester]);

  useEffect(() => {
    onFiltersChange({
      selectedSemester,
      selectedSubject,
      onlyAnswered
    });
  }, [selectedSemester, selectedSubject, onlyAnswered, onFiltersChange]);

  const getRandomQuestion = () => {
    const filteredQuestions = Object.entries(questions).filter(([id, q]) => {
      const matchSemester =
        !selectedSemester || q.semester === selectedSemester;
      const matchSubject = !selectedSubject || q.subject === selectedSubject;
      const matchAnswered = !onlyAnswered || answeredQuestions[id];
      return matchSemester && matchSubject && matchAnswered;
    });

    if (filteredQuestions.length === 0) {
      alert("Brak pytań spełniających kryteria!");
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    const [randomId] = filteredQuestions[randomIndex];
    onSelectQuestion(randomId);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="random-question-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Losowe pytanie</h2>

        <div className="random-filters">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="semester-selector"
          >
            <option value="">Wszystkie semestry</option>
            {filters.semesters.map((semester) => (
              <option key={semester} value={semester}>
                Semestr {semester}
              </option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="subject-selector"
          >
            <option value="">Wszystkie przedmioty</option>
            {availableSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <label className="answered-toggle">
            <input
              type="checkbox"
              checked={onlyAnswered}
              onChange={(e) => setOnlyAnswered(e.target.checked)}
            />
            Tylko odhaczone
          </label>
        </div>

        <div className="random-actions">
          <button className="random-button" onClick={getRandomQuestion}>
            Losuj pytanie
          </button>
          <button className="cancel-button" onClick={onClose}>
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
}
