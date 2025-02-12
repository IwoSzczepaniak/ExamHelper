import React from 'react';
import { Question } from '../types';

type QuestionCardProps = {
  id: string;
  question: Question;
  isAnswered: boolean;
  onToggleAnswered: (id: string) => void;
  onSelectQuestion: (id: string, question: Question) => void;
  onQuizQuestion: (id: string, question: Question) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  id,
  question,
  isAnswered,
  onToggleAnswered,
  onSelectQuestion,
  onQuizQuestion,
}) => {
  return (
    <div
      className={`question-card ${isAnswered ? "answered" : ""}`}
      onClick={() => onSelectQuestion(id, question)}
    >
      <div className="question-header">
        <span className="question-number">Pytanie {id}</span>
        <span className="question-semester">Semestr {question.semester}</span>
      </div>
      <div className="question-subject">{question.subject}</div>
      <div className="question-category">{question.category}</div>
      <div className="question-text">{question.question}</div>
      <div className="question-actions">
        <div
          className="answer-toggle"
          onClick={(e) => {
            e.stopPropagation();
            onToggleAnswered(id);
          }}
        >
          <input
            type="checkbox"
            checked={isAnswered}
            onChange={() => {}}
          />
          <span>Odhacz</span>
        </div>
        <button
          className="quiz-button"
          onClick={(e) => {
            e.stopPropagation();
            onQuizQuestion(id, question);
          }}
        >
          Odpytaj
        </button>
      </div>
    </div>
  );
};

export default QuestionCard; 