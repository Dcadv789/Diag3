"use client";

import { useState } from 'react';
import { Document, Page, Text, View, PDFDownloadLink, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  questionGroup: {
    marginTop: 15,
    marginBottom: 10,
  },
  question: {
    marginBottom: 8,
  },
});

interface PdfExportDiagnProps {
  assessment: {
    client_name: string;
    company_name: string;
    cnpj: string;
    created_at: string;
  };
  answers: Array<{
    question: {
      number: string;
      text: string;
      score_value: number;
    };
    answer: string;
    score: number;
  }>;
  totalScore: number;
  maxPossibleScore: number;
}

const DiagnosticDocument = ({ assessment, answers, totalScore, maxPossibleScore }: PdfExportDiagnProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Relatório de Diagnóstico</Text>
        
        <View style={styles.section}>
          <Text style={styles.subtitle}>Informações do Cliente</Text>
          <Text style={styles.text}>Cliente: {assessment.client_name}</Text>
          <Text style={styles.text}>Empresa: {assessment.company_name}</Text>
          <Text style={styles.text}>CNPJ: {assessment.cnpj}</Text>
          <Text style={styles.text}>
            Data: {new Date(assessment.created_at).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Pontuação Final</Text>
          <Text style={styles.text}>
            Total: {totalScore} de {maxPossibleScore} pontos
          </Text>
          <Text style={styles.text}>
            Percentual: {((totalScore / maxPossibleScore) * 100).toFixed(1)}%
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Respostas</Text>
          {answers.map((answer, index) => (
            <View key={index} style={styles.question}>
              <Text style={styles.text}>
                {answer.question.number}. {answer.question.text}
              </Text>
              <Text style={styles.text}>
                Resposta: {answer.answer} (Pontuação: {answer.score})
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export function PdfExportDiagn({ assessment, answers, totalScore, maxPossibleScore }: PdfExportDiagnProps) {
  return (
    <PDFDownloadLink
      document={
        <DiagnosticDocument
          assessment={assessment}
          answers={answers}
          totalScore={totalScore}
          maxPossibleScore={maxPossibleScore}
        />
      }
      fileName={`diagnostico-${assessment.client_name.toLowerCase().replace(/\s+/g, '-')}.pdf`}
    >
      {({ loading }) => (
        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? 'Gerando PDF...' : 'Baixar PDF'}
        </button>
      )}
    </PDFDownloadLink>
  );
}