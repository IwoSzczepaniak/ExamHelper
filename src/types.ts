export type Question = {
  subject: string;
  semester: string;
  category: string;
  question: string;
}

export type Questions = {
  [key: string]: Question;
};

export type AnsweredQuestions = {
  [key: string]: boolean;
};

export type QuestionNotes = {
  [key: string]: string;
}

export type ExistingFiles = {
  opracowanie_1: boolean;
  opracowanie_2: boolean;
  data_in: boolean;
}