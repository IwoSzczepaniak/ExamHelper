import { Questions } from "../types";

export const filterQuestions = (
    questions: Questions,
    filters: {
      semester?: string;
      subject?: string;
      category?: string;
      hideAnswered?: boolean;
      onlyAnswered?: boolean;
      searchQuery?: string;
    },
    answeredQuestions: Record<string, boolean>
  ) => {
    const searchLower = filters.searchQuery?.toLowerCase() || '';
    
    return Object.entries(questions).filter(([id, q]) => {
      const matchCategory = !filters.category || q.category === filters.category;
      const matchSemester = !filters.semester || q.semester === filters.semester;
      const matchSubject = !filters.subject || q.subject === filters.subject;
      
      // Handle both hideAnswered and onlyAnswered cases
      const matchAnswered = filters.onlyAnswered
        ? answeredQuestions[id]
        : !filters.hideAnswered || !answeredQuestions[id];

      // Search in question text and subject
      const matchSearch = !filters.searchQuery || (
        (q.question.toLowerCase().includes(searchLower) ||
        q.subject.toLowerCase().includes(searchLower))
      );

      return matchCategory && matchSemester && matchSubject && matchAnswered && matchSearch;
    });
  };