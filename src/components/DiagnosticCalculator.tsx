import React, { useEffect } from 'react';
import { useStore } from '../lib/store';

interface CalculateScoreProps {
  answers: Record<string, string>;
  onComplete: (result: {
    totalScore: number;
    maxPossibleScore: number;
    answers: Array<{
      question_id: string;
      answer: string;
      score: number;
    }>;
  }) => void;
}

export function DiagnosticCalculator({ answers, onComplete }: CalculateScoreProps) {
  const { questions } = useStore();

  const calculateScore = () => {
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    // Primeiro calcula o valor máximo possível
    maxPossibleScore = questions.reduce((sum, question) => sum + question.score_value, 0);
    
    const calculatedAnswers = Object.entries(answers).map(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      if (!question) return null;

      let score = 0;

      // Se a resposta for "Em partes", sempre soma metade dos pontos
      if (answer === 'partial') {
        score = question.score_value / 2;
      }
      // Se não for "Em partes", verifica a configuração da pergunta
      else if (
        (question.score_type === 'full' && answer === 'yes') || // Configurado para somar no "Sim" e respondeu "Sim"
        (question.score_type === 'none' && answer === 'no')     // Configurado para somar no "Não" e respondeu "Não"
      ) {
        score = question.score_value;
      }

      totalScore += score;

      return {
        question_id: questionId,
        answer,
        score
      };
    }).filter((answer): answer is NonNullable<typeof answer> => answer !== null);

    onComplete({
      totalScore,
      maxPossibleScore,
      answers: calculatedAnswers
    });
  };

  useEffect(() => {
    calculateScore();
  }, [answers]);

  return null;
}