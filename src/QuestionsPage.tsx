import { useMemo, useState } from "react";
import "./App.css";
import Filters from "./components/Filters";
import QuestionCard from "./components/QuestionCard";
import { QuestionDisplay } from "./components/QuestionDisplay";
import QuestionModal from "./components/QuestionModal";
import { RandomQuestion } from "./components/RandomQuestion";
import { filterQuestions } from "./helpers/filter-questions";
import { useAnsweredQuestions } from "./hooks/useAnsweredQuestions";
import { useFilters } from "./hooks/useFilters";
import questionsData from "./questions.json";
import { Question, Questions } from "./types";

function QuestionsPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<{
    id: string;
    question: Question;
  } | null>(null);
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [randomQuestion, setRandomQuestion] = useState<{
    id: string;
    question: Question;
  } | null>(null);
  const [randomQuestionFilters, setRandomQuestionFilters] = useState({
    semester: "",
    subject: "",
    onlyAnswered: false,
  });

  const { answeredQuestions, toggleAnswered, resetAllAnswers } =
    useAnsweredQuestions();
  const filterParams = useFilters(questionsData);

  const questions: Questions = questionsData;

  const totalQuestions = Object.keys(questions).length;
  const answeredQuestionsCount = Object.keys(answeredQuestions).length;

  const filteredQuestions = useMemo(() => {
    return filterQuestions(
      questions,
      {
        category: filterParams.selectedCategory,
        semester: filterParams.selectedSemester,
        subject: filterParams.selectedSubject,
        hideAnswered: filterParams.hideAnswered,
        searchQuery: filterParams.searchQuery,
      },
      answeredQuestions
    );
  }, [filterParams, questions, answeredQuestions]);

  const getRandomFilteredQuestion = () => {
    const filtered = filterQuestions(
      questions,
      {
        semester: randomQuestionFilters.semester,
        subject: randomQuestionFilters.subject,
        onlyAnswered: randomQuestionFilters.onlyAnswered,
      },
      answeredQuestions
    );

    const randomIndex = Math.floor(Math.random() * filtered.length);
    const [randomId, randomQuestion] = filtered[randomIndex];
    return { id: randomId, question: randomQuestion };
  };

  return (
    <div className="app">
      <Filters
        filterParams={filterParams}
        onResetAnswers={resetAllAnswers}
        onShowRandomModal={() => setShowRandomModal(true)}
        answeredCount={answeredQuestionsCount}
        totalCount={totalQuestions}
      />

      <div className="questions">
        {filteredQuestions.map(([id, question]) => (
          <QuestionCard
            key={id}
            id={id}
            question={question}
            isAnswered={!!answeredQuestions[id]}
            onToggleAnswered={toggleAnswered}
            onSelectQuestion={(id, q) =>
              setSelectedQuestion({ id, question: q })
            }
            onQuizQuestion={(id, q) => setRandomQuestion({ id, question: q })}
          />
        ))}
      </div>

      {selectedQuestion && (
        <QuestionModal
          id={selectedQuestion.id}
          question={selectedQuestion.question}
          isAnswered={!!answeredQuestions[selectedQuestion.id]}
          onToggleAnswered={toggleAnswered}
          onClose={() => setSelectedQuestion(null)}
          selectedModel={filterParams.selectedModel}
        />
      )}

      {showRandomModal && (
        <RandomQuestion
          questions={questions}
          answeredQuestions={answeredQuestions}
          onClose={() => setShowRandomModal(false)}
          onSelectQuestion={(id) => {
            setRandomQuestion({
              id,
              question: questions[id],
            });
            setShowRandomModal(false);
          }}
          filters={filterParams.filters}
          onFiltersChange={(filters) => {
            setRandomQuestionFilters({
              semester: filters.selectedSemester,
              subject: filters.selectedSubject,
              onlyAnswered: filters.onlyAnswered,
            });
          }}
        />
      )}

      {randomQuestion && (
        <QuestionDisplay
          id={randomQuestion.id}
          question={randomQuestion.question}
          onClose={() => setRandomQuestion(null)}
          onNextQuestion={() => {
            const nextQuestion = getRandomFilteredQuestion();
            setRandomQuestion(nextQuestion);
          }}
        />
      )}
    </div>
  );
}

export default QuestionsPage;
