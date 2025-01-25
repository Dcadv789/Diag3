"use client";

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PdfExportDiagn } from '@/components/PdfExportDiagn';
import { FileDown, Search } from 'lucide-react';

export default function ResultadosPage() {
  const { assessments, questions, fetchAssessments } = useStore();
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  const calculateScores = (assessment: any) => {
    if (!assessment) return { total: 0, max: 0 };
    
    const total = assessment.answers.reduce((sum: number, answer: any) => sum + answer.score, 0);
    const max = questions.reduce((sum, question) => sum + question.score_value, 0);
    
    return { total, max };
  };

  const filteredAssessments = assessments.filter(assessment => 
    assessment.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.cnpj.includes(searchTerm)
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Resultados</h1>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar diagnósticos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-background border rounded-md w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Diagnósticos Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAssessments.length > 0 ? (
                filteredAssessments.map((assessment) => {
                  const { total, max } = calculateScores(assessment);
                  const percentage = ((total / max) * 100).toFixed(1);

                  return (
                    <div
                      key={assessment.id}
                      className="p-4 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => setSelectedAssessment(assessment)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{assessment.client_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {assessment.company_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(assessment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">{percentage}%</p>
                          <p className="text-sm text-muted-foreground">
                            {total} de {max} pontos
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'Nenhum diagnóstico encontrado' : 'Nenhum diagnóstico realizado ainda'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedAssessment && (
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Diagnóstico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Informações</h3>
                  <div className="space-y-2">
                    <p><span className="text-muted-foreground">Cliente:</span> {selectedAssessment.client_name}</p>
                    <p><span className="text-muted-foreground">Empresa:</span> {selectedAssessment.company_name}</p>
                    <p><span className="text-muted-foreground">CNPJ:</span> {selectedAssessment.cnpj}</p>
                    <p><span className="text-muted-foreground">Data:</span> {new Date(selectedAssessment.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Pontuação</h3>
                  {(() => {
                    const { total, max } = calculateScores(selectedAssessment);
                    const percentage = ((total / max) * 100).toFixed(1);
                    return (
                      <div className="space-y-2">
                        <p><span className="text-muted-foreground">Total:</span> {total} de {max} pontos</p>
                        <p><span className="text-muted-foreground">Percentual:</span> {percentage}%</p>
                      </div>
                    );
                  })()}
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Respostas</h3>
                  <div className="space-y-4">
                    {selectedAssessment.answers.map((answer: any, index: number) => {
                      const question = questions.find(q => q.id === answer.question_id);
                      if (!question) return null;

                      return (
                        <div key={index} className="p-4 bg-secondary rounded-lg">
                          <p className="font-medium">{question.number}. {question.text}</p>
                          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                            <span>
                              Resposta: {
                                answer.answer === 'yes' ? 'Sim' :
                                answer.answer === 'partial' ? 'Às vezes' : 'Não'
                              }
                            </span>
                            <span>Pontos: {answer.score}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4">
                  <PdfExportDiagn
                    assessment={selectedAssessment}
                    answers={selectedAssessment.answers.map((answer: any) => ({
                      ...answer,
                      question: questions.find(q => q.id === answer.question_id)
                    }))}
                    totalScore={calculateScores(selectedAssessment).total}
                    maxPossibleScore={calculateScores(selectedAssessment).max}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}