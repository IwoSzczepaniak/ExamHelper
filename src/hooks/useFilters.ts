import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Questions } from '../types';

export const useFilters = (questions: Questions) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");
  const [selectedSemester, setSelectedSemester] = useState<string>(searchParams.get("semester") || "");
  const [selectedSubject, setSelectedSubject] = useState<string>(searchParams.get("subject") || "");
  const [hideAnswered, setHideAnswered] = useState(searchParams.get("hideAnswered") === "true");
  const [selectedModel, setSelectedModel] = useState<"GPT-3.5-TURBO" | "GPT-4">(
    (searchParams.get("model") as "GPT-3.5-TURBO" | "GPT-4") || "GPT-4"
  );
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("search") || "");

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedSemester) params.set("semester", selectedSemester);
    if (selectedSubject) params.set("subject", selectedSubject);
    if (hideAnswered) params.set("hideAnswered", "true");
    if (selectedModel) params.set("model", selectedModel);
    if (searchQuery) params.set("search", searchQuery);
    setSearchParams(params);
  }, [selectedCategory, selectedSemester, selectedSubject, hideAnswered, selectedModel, searchQuery, setSearchParams]);

  const filters = useMemo(() => {
    const categories = new Set<string>();
    const semesters = new Set<string>();
    const subjects = new Set<string>();

    Object.values(questions).forEach((q) => {
      categories.add(q.category);
      semesters.add(q.semester);
      if (!selectedSemester || q.semester === selectedSemester) {
        subjects.add(q.subject);
      }
    });

    return {
      categories: Array.from(categories).sort(),
      semesters: Array.from(semesters).sort((a, b) => Number(a) - Number(b)),
      subjects: Array.from(subjects).sort(),
    };
  }, [questions, selectedSemester]);

  useEffect(() => {
    setSelectedSubject("");
  }, [selectedSemester]);

  return {
    selectedCategory,
    setSelectedCategory,
    selectedSemester,
    setSelectedSemester,
    selectedSubject,
    setSelectedSubject,
    hideAnswered,
    setHideAnswered,
    selectedModel,
    setSelectedModel,
    searchQuery,
    setSearchQuery,
    filters
  };
};
