import React from "react";

type FilterParams = {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSemester: string;
  setSelectedSemester: (semester: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  hideAnswered: boolean;
  setHideAnswered: (hide: boolean) => void;
  selectedModel: "GPT-3.5-TURBO" | "GPT-4";
  setSelectedModel: (model: "GPT-3.5-TURBO" | "GPT-4") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: {
    categories: string[];
    semesters: string[];
    subjects: string[];
  };
};

type FiltersProps = {
  filterParams: FilterParams;
  onResetAnswers: () => void;
  onShowRandomModal: () => void;
  answeredCount: number;
  totalCount: number;
};

const Filters: React.FC<FiltersProps> = ({
  filterParams,
  onResetAnswers,
  onShowRandomModal,
  answeredCount,
  totalCount,
}) => {
  return (
    <>
      <div className="filters">
        <select
          value={filterParams.selectedCategory}
          onChange={(e) => filterParams.setSelectedCategory(e.target.value)}
          className="category-selector"
        >
          <option value="">Wszystkie kategorie</option>
          {filterParams.filters.categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filterParams.selectedSemester}
          onChange={(e) => filterParams.setSelectedSemester(e.target.value)}
          className="semester-selector"
        >
          <option value="">Wszystkie semestry</option>
          {filterParams.filters.semesters.map((semester) => (
            <option key={semester} value={semester}>
              Semestr {semester}
            </option>
          ))}
        </select>

        <select
          value={filterParams.selectedSubject}
          onChange={(e) => filterParams.setSelectedSubject(e.target.value)}
          className="subject-selector"
        >
          <option value="">Wszystkie przedmioty</option>
          {filterParams.filters.subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        <label className="hide-answered-toggle">
          <input
            type="checkbox"
            checked={filterParams.hideAnswered}
            onChange={(e) => filterParams.setHideAnswered(e.target.checked)}
          />
          Ukryj odhaczone
        </label>

        <button className="reset-answers-button" onClick={onResetAnswers}>
          Resetuj odhaczone pytania
        </button>

        <select
          value={filterParams.selectedModel}
          onChange={(e) =>
            filterParams.setSelectedModel(
              e.target.value as "GPT-3.5-TURBO" | "GPT-4"
            )
          }
          className="model-selector"
        >
          <option value="GPT-4">GPT-4</option>
          <option value="GPT-3.5-TURBO">GPT-3.5-TURBO</option>
        </select>


      </div>
      <div className="filters-top">
        <input
          type="text"
          placeholder="Szukaj pytań..."
          value={filterParams.searchQuery}
          onChange={(e) => filterParams.setSearchQuery(e.target.value)}
          className="search-input"
        />
        <div className="counter">
          Odhaczone: {answeredCount}/{totalCount}
        </div>
        <button className="random-question-button" onClick={onShowRandomModal}>
          Losuj pytanie
        </button>
      </div>
    </>
  );
};

export default Filters;
