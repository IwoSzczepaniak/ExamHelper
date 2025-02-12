import React from "react";
import { Question, QuestionNotes } from "../types";
import { useAI } from "../hooks/useAI";
import { useQuestionNotes } from "../hooks/useQuestionNotes";
import MyPdfViewer from "./MyPdfViewer";
import { PdfSearchProvider, usePdfSearch } from "../contexts/PdfSearchContext";

type QuestionModalProps = {
  id: string;
  question: Question;
  isAnswered: boolean;
  onToggleAnswered: (id: string) => void;
  onClose: () => void;
  selectedModel: string;
};

const PdfContainer: React.FC<{ question: Question }> = ({ question }) => {
  const { showSearch, searchInputRef, searchQuery, setSearchQuery, setShowSearch } = usePdfSearch();

  return (
    <div className="pdf-container">
      {showSearch && (
        <div className="pdf-search-container">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in PDFs..."
            className="pdf-search-input"
          />
          <button
            onClick={() => setShowSearch(false)}
            className="pdf-search-close"
          >
            ×
          </button>
        </div>
      )}
      <div className="pdf-preview">
        <h3>Opracowanie 1:</h3>
        <MyPdfViewer file="opracowanie_1.pdf" query={question.question} />
      </div>
      <div className="pdf-preview">
        <h3>Opracowanie 2:</h3>
        <MyPdfViewer file="opracowanie_2.pdf" query={question.question} />
      </div>
    </div>
  );
};

const QuestionModal: React.FC<QuestionModalProps> = ({
  id,
  question,
  isAnswered,
  onToggleAnswered,
  onClose,
  selectedModel,
}) => {
  const {
    loading,
    error,
    answer,
    handleSelectedQuestion,
    setAnswer,
    setError,
  } = useAI();
  const { notes, setNotes } = useQuestionNotes();

  const handleAskQuestion = (question: string, subject: string) => {
    handleSelectedQuestion(question, subject, selectedModel);
  };

  const handleCopyQuestion = (question: string) => {
    navigator.clipboard
      .writeText(question)
      .then(() => console.log("Question copied"))
      .catch((err) => console.error("Copy failed:", err));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Pytanie {id}</h2>
          <div className="modal-actions">
            <label className="modal-checkbox">
              <input
                type="checkbox"
                checked={isAnswered}
                onChange={() => onToggleAnswered(id)}
              />
              Odhacz
            </label>
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          </div>
        </div>
        <div className="modal-body">
          <div className="modal-subject">Przedmiot: {question.subject}</div>
          <div className="modal-semester">Semestr: {question.semester}</div>
          <div className="modal-category">Kategoria: {question.category}</div>
          <div className="modal-question">
            {question.question}
            <button
              className="copy-button"
              onClick={(e) => {
                e.stopPropagation();
                handleCopyQuestion(question.question);
              }}
            >
              📋
            </button>
          </div>

          <PdfSearchProvider>
            <PdfContainer question={question} />
          </PdfSearchProvider>

          <div className="notes-section">
            <h3>Notatki:</h3>
            <textarea
              value={notes[id] || ""}
              onChange={(e) =>
                setNotes((prev) => ({ ...prev, [id]: e.target.value }))
              }
              placeholder="Tutaj możesz dodać swoje notatki..."
              className="notes-textarea"
            />
          </div>

          <div className="ask-section">
            <button
              className="ask-button"
              onClick={() =>
                handleAskQuestion(question.question, question.subject)
              }
              disabled={loading}
            >
              {loading ? "Pytam..." : "Zapytaj AI"}
            </button>

            {error && <div className="error-message">{error}</div>}

            {answer && (
              <div className="ai-answer">
                <h3>Odpowiedź AI:</h3>
                <p>{answer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
