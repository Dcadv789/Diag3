import React, { useState, useEffect } from 'react';
import { FileDown, Search, Trash2 } from 'lucide-react';
import { useStore } from '../lib/store';

export default function Results() {
  const { assessments, questions, groups, fetchAssessments, fetchGroups, deleteAssessment } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);

  useEffect(() => {
    fetchAssessments();
    fetchGroups();
  }, [fetchAssessments, fetchGroups]);

  const calculateScores = (assessment: any) => {
    if (!assessment) return { groupScores: {}, totalGeral: 0, maxGeral: 0 };
    
    const groupScores = assessment.answers.reduce((acc: any, answer: any) => {
      const question = questions.find(q => q.id === answer.question_id);
      if (!question) return acc;

      if (!acc[question.group_id]) {
        acc[question.group_id] = {
          earned: 0,
          possible: 0,
          questions: []
        };
      }

      let score = 0;
      if (answer.answer === 'partial') {
        score = question.score_value / 2;
      } else if (
        (question.score_type === 'full' && answer.answer === 'yes') ||
        (question.score_type === 'none' && answer.answer === 'no')
      ) {
        score = question.score_value;
      }

      acc[question.group_id].earned += score;
      acc[question.group_id].possible += question.score_value;
      acc[question.group_id].questions.push({
        ...question,
        answer,
        score
      });

      return acc;
    }, {});

    const totalGeral = Object.values(groupScores).reduce((sum: any, group: any) => sum + group.earned, 0);
    const maxGeral = Object.values(groupScores).reduce((sum: any, group: any) => sum + group.possible, 0);
    
    return { groupScores, totalGeral, maxGeral };
  };

  const handleDeleteAssessment = (assessmentId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este diagnóstico?')) {
      deleteAssessment(assessmentId);
      if (selectedAssessment?.id === assessmentId) {
        setSelectedAssessment(null);
      }
    }
  };

  const filteredAssessments = assessments.filter(assessment => 
    assessment.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.cnpj.includes(searchTerm)
  );

  const handleExportPDF = (assessment: any) => {
    const { groupScores, totalGeral, maxGeral } = calculateScores(assessment);
    alert(`Em breve: Exportar diagnóstico de ${assessment.client_name}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Resultados</h1>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar diagnósticos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Diagnósticos Realizados</h2>
          <div className="space-y-4">
            {filteredAssessments.length > 0 ? (
              filteredAssessments.map((assessment) => {
                const { groupScores, totalGeral, maxGeral } = calculateScores(assessment);
                const totalGeralFormatted = ((totalGeral / maxGeral) * 100).toFixed(1);

                return (
                  <div
                    key={assessment.id}
                    onClick={() => setSelectedAssessment(assessment)}
                    className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors relative group"
                  >
                    <button
                      onClick={(e) => handleDeleteAssessment(assessment.id, e)}
                      className="absolute right-2 top-2 p-2 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{assessment.client_name}</h3>
                        <p className="text-sm text-gray-400">
                          {assessment.company_name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(assessment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">{totalGeralFormatted}%</p>
                        <p className="text-sm text-gray-400">
                          {totalGeral} de {maxGeral} pontos
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-400">
                {searchTerm ? 'Nenhum diagnóstico encontrado' : 'Nenhum diagnóstico realizado ainda'}
              </div>
            )}
          </div>
        </div>

        {selectedAssessment && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Detalhes do Diagnóstico</h2>
              <button
                onClick={() => setSelectedAssessment(null)}
                className="text-gray-400 hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Informações</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-400">Cliente:</span> {selectedAssessment.client_name}</p>
                  <p><span className="text-gray-400">Empresa:</span> {selectedAssessment.company_name}</p>
                  <p><span className="text-gray-400">CNPJ:</span> {selectedAssessment.cnpj}</p>
                  <p><span className="text-gray-400">Tem Sócios:</span> {selectedAssessment.has_partners}</p>
                  <p><span className="text-gray-400">Faturamento:</span> {selectedAssessment.revenue}</p>
                  <p><span className="text-gray-400">Setor:</span> {selectedAssessment.sector}</p>
                  <p><span className="text-gray-400">Tempo de Atividade:</span> {selectedAssessment.time_in_business}</p>
                  <p><span className="text-gray-400">Funcionários:</span> {selectedAssessment.employees_count}</p>
                  <p><span className="text-gray-400">Localização:</span> {selectedAssessment.location}</p>
                  <p><span className="text-gray-400">Forma Jurídica:</span> {selectedAssessment.legal_form}</p>
                  <p><span className="text-gray-400">Data:</span> {new Date(selectedAssessment.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Pontuação Total</h3>
                {(() => {
                  const { groupScores, totalGeral, maxGeral } = calculateScores(selectedAssessment);
                  const totalGeralFormatted = ((totalGeral / maxGeral) * 100).toFixed(1);
                  return (
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-lg">{totalGeral} de {maxGeral} pontos</span>
                        <span className="text-2xl font-bold">{totalGeralFormatted}%</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div>
                <h3 className="font-semibold mb-4">Pontuação por Pilar</h3>
                {(() => {
                  const { groupScores } = calculateScores(selectedAssessment);
                  return Object.entries(groupScores).map(([groupId, data]: [string, any]) => {
                    const group = groups.find(g => g.id === groupId);
                    if (!group) return null;

                    const percentage = ((data.earned / data.possible) * 100).toFixed(1);
                    
                    return (
                      <div key={groupId} className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{group.name}</h4>
                          <div className="text-right">
                            <p className="text-lg font-semibold">{percentage}%</p>
                            <p className="text-sm text-gray-400">
                              {data.earned} de {data.possible} pontos
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {data.questions.map((item: any) => (
                            <div key={item.id} className="p-3 bg-gray-600 rounded">
                              <p className="font-medium">{item.number}. {item.text}</p>
                              <div className="mt-2 flex justify-between text-sm text-gray-400">
                                <span>
                                  Resposta: {
                                    item.answer.answer === 'yes' ? 'Sim' :
                                    item.answer.answer === 'partial' ? 'Em partes' : 'Não'
                                  }
                                </span>
                                <span>Pontos: {item.score} de {item.score_value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => handleExportPDF(selectedAssessment)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  Exportar PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}