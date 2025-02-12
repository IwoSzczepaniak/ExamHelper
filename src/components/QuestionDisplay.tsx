import { useState } from "react";
import { getAzureCompletion } from "../services/azure";
import { Question } from "../types";
import { useQuestionNotes } from "../hooks/useQuestionNotes";

type QuestionDisplayProps = {
  id: string;
  question: Question;
  onClose: () => void;
  onNextQuestion: () => void;
};

export function QuestionDisplay({
  id,
  question,
  onClose,
  onNextQuestion,
}: QuestionDisplayProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [loading, setLoading] = useState(false);
  const { notes, setNotes } = useQuestionNotes();

  const handleEvaluation = async () => {
    if (!userAnswer.trim()) {
      alert("Proszę wprowadzić odpowiedź przed oceną!");
      return;
    }

    setLoading(true);
    try {
      const prompt = `
JESTEŚ WYMAGAJĄCYM NAUCZYCIELEM AKADEMICKIM OCENIAJĄCYM STUDENTA NA EGZAMINIE INŻYNIERSKIM.

<question>
${question.question}
</question>

<requirements>
- Podaj wynik punktowy i krótkie uzasadnienie w każdej kategorii.
- ZWRÓĆ SZCZEGÓŁOWE WYJAŚNIENIE CZEGO ZABRAKŁO - WSPOMNIJ CO BYŚ DODAŁ DO ODPOWIEDZI.
- Na końcu dodaj sumaryczną ocenę i ogólny komentarz. Nisko oceniaj odpwoiedzi, które nie odpowiadają w pełni na pytanie.
- Wymień po kolei wszystkie istotne elementy odpowiedzi, które należy poruszyć w odpowiedzi.
- Nisko oceniaj bardzo krótkie odpowiedzi, które nie poruszają istotnych elementów.
- Max 500 tokens
- NIE UŻYWAJ MARKDOWN
- Oceń odpowiedź studenta pod kątem:
    1. Poprawności merytorycznej (0-3 pkt)
    2. Kompletności odpowiedzi (0-5 pkt)
    3. Precyzji wypowiedzi (0-2 pkt)
</requirements>

<correct_answer>
${notes?.[id] || ""}
</correct_answer>
`;

      const response = await getAzureCompletion({
        question: userAnswer,
        subject: question.subject,
        modelName: "gpt-35-turbo",
        apiVersion: process.env.REACT_APP_AZURE_API_VERSION || "",
        systemPrompt: prompt,
      });

      setEvaluation(response);
    } catch (error) {
      console.error("Error getting evaluation:", error);
      setEvaluation("Wystąpił błąd podczas oceniania odpowiedzi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="question-display-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="question-display-header">
          <h2>Pytanie {id}</h2>
          <div className="question-display-actions">
            <button 
              className="next-question-button"
              onClick={(e) => {
                e.stopPropagation();
                onNextQuestion();
                setEvaluation("");
                setUserAnswer("");
              }}
            >
              Nowe losowe pytanie
            </button>
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          </div>
        </div>
        <div className="question-display-content">
          <div className="question-display-info">
            <span>Semestr {question.semester}</span>
            <span>{question.subject}</span>
            <span>{question.category}</span>
          </div>
          <div className="question-display-text">{question.question}</div>

          <div className="answer-section">
            <h3>Twoja odpowiedź:</h3>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Wpisz swoją odpowiedź tutaj..."
              className="answer-textarea"
            />
            <button
              className="evaluate-button"
              onClick={handleEvaluation}
              disabled={loading}
            >
              {loading ? "Oceniam..." : "Oceń odpowiedź"}
            </button>
          </div>

          {evaluation && (
            <div className="evaluation-section">
              <h3>Ocena odpowiedzi:</h3>

              <div className="evaluation-text">{evaluation}</div>
              {notes?.[id] && (
                <div className="original-note">
                  <h4>Twoja notatka:</h4>
                  <div className="note-text">{notes[id]}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
