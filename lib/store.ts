import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Group {
  id: string;
  name: string;
  order: number;
}

interface Question {
  id: string;
  group_id: string;
  number: string;
  text: string;
  score_value: number;
  score_type: 'full' | 'half' | 'none';
  order: number;
}

interface Assessment {
  id: string;
  client_name: string;
  company_name: string;
  cnpj: string;
  created_at: string;
  answers: Array<{
    question_id: string;
    answer: string;
    score: number;
  }>;
}

interface Store {
  groups: Group[];
  questions: Question[];
  assessments: Assessment[];
  fetchGroups: () => void;
  fetchQuestions: () => void;
  fetchAssessments: () => void;
  addGroup: (name: string) => void;
  addQuestion: (question: Omit<Question, 'id'>) => void;
  addAssessment: (assessment: Omit<Assessment, 'id' | 'created_at'>) => void;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      groups: [],
      questions: [],
      assessments: [],

      fetchGroups: () => {
        // Data is already loaded from persist middleware
      },

      fetchQuestions: () => {
        // Data is already loaded from persist middleware
      },

      fetchAssessments: () => {
        // Data is already loaded from persist middleware
      },

      addGroup: (name: string) => {
        const { groups } = get();
        const newGroup = {
          id: crypto.randomUUID(),
          name,
          order: groups.length,
        };
        set({ groups: [...groups, newGroup] });
      },

      updateGroup: (id: string, updates: Partial<Group>) => {
        const { groups } = get();
        set({
          groups: groups.map((group) =>
            group.id === id ? { ...group, ...updates } : group
          ),
        });
      },

      deleteGroup: (id: string) => {
        const { groups, questions } = get();
        set({
          groups: groups.filter((group) => group.id !== id),
          questions: questions.filter((question) => question.group_id !== id),
        });
      },

      addQuestion: (question) => {
        const { questions } = get();
        const newQuestion = {
          ...question,
          id: crypto.randomUUID(),
        };
        set({ questions: [...questions, newQuestion] });
      },

      updateQuestion: (id: string, updates: Partial<Question>) => {
        const { questions } = get();
        set({
          questions: questions.map((question) =>
            question.id === id ? { ...question, ...updates } : question
          ),
        });
      },

      deleteQuestion: (id: string) => {
        const { questions } = get();
        set({
          questions: questions.filter((question) => question.id !== id),
        });
      },

      addAssessment: (assessment) => {
        const { assessments } = get();
        const newAssessment = {
          ...assessment,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
        };
        set({ assessments: [...assessments, newAssessment] });
      },
    }),
    {
      name: 'diagnostic-storage',
    }
  )
);