export interface Question {
  id: string;
  groupId: string;
  number: string;
  text: string;
  description: string;
  points: number;
  scoreType: 'full' | 'half' | 'none';
  answerType: 'yes_no' | 'yes_partial_no';
}

export interface QuestionGroup {
  id: number;
  name: string;
  order: number;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  cnpj: string;
  createdAt: string;
}

export interface Assessment {
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