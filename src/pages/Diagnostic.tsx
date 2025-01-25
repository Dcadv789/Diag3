import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, X, Gem } from 'lucide-react';
import { useStore } from '../lib/store';
import { DiagnosticCalculator } from '../components/DiagnosticCalculator';
import { SparklesCore } from '../components/SparklesCore';
import { useToast } from "../../hooks/use-toast";

function DiagnosticModal({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { groups, questions, addAssessment } = useStore();
  const [step, setStep] = useState<'client-info' | 'questions' | 'calculating'>('client-info');
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [clientInfo, setClientInfo] = useState({
    name: '',
    company: '',
    cnpj: '',
    has_partners: '',
    revenue: '',
    sector: '',
    time_in_business: '',
    employees_count: '',
    location: '',
    legal_form: '',
  });

  const currentGroup = groups[currentGroupIndex];
  const groupQuestions = currentGroup
    ? questions.filter(q => q.group_id === currentGroup.id)
    : [];

  const isCurrentGroupComplete = currentGroup
    ? groupQuestions.every(q => answers[q.id])
    : false;

  const calculateProgress = () => {
    const totalAnswered = Object.keys(answers).length;
    const totalAvailable = groups.reduce((total, group) => {
      const groupQuestionsCount = questions.filter(q => q.group_id === group.id).length;
      return total + groupQuestionsCount;
    }, 0);
    
    if (totalAvailable === 0) return 0;
    return Math.min((totalAnswered / totalAvailable) * 100, 100);
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('questions');
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => {
      if (prev[questionId] === value) {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      }
      return {
        ...prev,
        [questionId]: value
      };
    });
  };

  const handleNextGroup = () => {
    if (currentGroupIndex < groups.length - 1) {
      setCurrentGroupIndex(prev => prev + 1);
    }
  };

  const handlePreviousGroup = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex(prev => prev - 1);
    }
  };

  const handleFinishDiagnostic = () => {
    setStep('calculating');
  };

  const handleCalculationComplete = async (result: {
    totalScore: number;
    maxPossibleScore: number;
    answers: Array<{
      question_id: string;
      answer: string;
      score: number;
    }>;
  }) => {
    await addAssessment({
      client_name: clientInfo.name,
      company_name: clientInfo.company,
      cnpj: clientInfo.cnpj,
      has_partners: clientInfo.has_partners,
      revenue: clientInfo.revenue,
      sector: clientInfo.sector,
      time_in_business: clientInfo.time_in_business,
      employees_count: clientInfo.employees_count,
      location: clientInfo.location,
      legal_form: clientInfo.legal_form,
      answers: result.answers
    });

    navigate('/resultados');
  };

  const handleCloseDiagnostic = () => {
    toast({
      title: "Sair do diagnóstico",
      description: "Tem certeza que deseja sair do diagnóstico? Todo o progresso será perdido.",
      action: (
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
          >
            Sair
          </button>
          <button
            onClick={() => document.querySelector('[data-toast-close]')?.click()}
            className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
          >
            Cancelar
          </button>
        </div>
      ),
    });
  };

  const progress = calculateProgress();

  return (
    <div className="fixed inset-0 bg-black z-50">
      <SparklesCore
        background="transparent"
        particleColor="rgba(255, 255, 255, 0.8)"
        particleDensity={100}
        speed={0.5}
        minSize={0.5}
        maxSize={1}
      />
      
      <div className="h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-gray-900/80 backdrop-blur-sm flex flex-col max-h-screen relative rounded-2xl overflow-hidden">
          <div className="bg-gray-800/80 p-8 border-b border-gray-700 flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-4">Diagnóstico Empresarial</h1>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <span className="text-sm text-gray-400 block mb-1">Nome</span>
                  <span className="text-xl text-gray-200">{clientInfo.name || '---'}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-400 block mb-1">Empresa</span>
                  <span className="text-xl text-gray-200">{clientInfo.company || '---'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-400">powered by</span>
                <div className="flex items-center gap-2">
                  <Gem className="w-6 h-6 text-blue-400" />
                  <span className="text-xl font-semibold text-white">DiagnósticoPRO</span>
                </div>
              </div>
              <button
                onClick={handleCloseDiagnostic}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {step === 'questions' && (
              <div className="px-8 pt-6">
                <div className="w-full bg-gray-700/50 h-4 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300 ease-out rounded-full flex items-center justify-end relative"
                    style={{ width: `${progress}%` }}
                  >
                    <span className="absolute right-2 text-[10px] font-medium text-white">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {step === 'client-info' && (
              <div className="p-8">
                <form onSubmit={handleSubmitInfo} className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Nome</label>
                      <input
                        type="text"
                        required
                        value={clientInfo.name}
                        onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Nome da Empresa</label>
                      <input
                        type="text"
                        required
                        value={clientInfo.company}
                        onChange={(e) => setClientInfo({ ...clientInfo, company: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">CNPJ</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex.: 00.000.000/0000-00"
                        value={clientInfo.cnpj}
                        onChange={(e) => setClientInfo({ ...clientInfo, cnpj: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Tem Sócios</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex.: Sim ou não"
                        value={clientInfo.has_partners}
                        onChange={(e) => setClientInfo({ ...clientInfo, has_partners: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Faturamento</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex.: R$ 100.000,00"
                        value={clientInfo.revenue}
                        onChange={(e) => setClientInfo({ ...clientInfo, revenue: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Setor de Atuação</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex.: Comércio, Serviços, Indústria, Tecnologia, etc."
                        value={clientInfo.sector}
                        onChange={(e) => setClientInfo({ ...clientInfo, sector: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Tempo de Atividade</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex.: Menos de 1 ano, 1 a 3 anos, mais de 3 anos"
                        value={clientInfo.time_in_business}
                        onChange={(e) => setClientInfo({ ...clientInfo, time_in_business: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Número de funcionários</label>
                      <input
                        type="text"
                        required
                        value={clientInfo.employees_count}
                        onChange={(e) => setClientInfo({ ...clientInfo, employees_count: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Localização Principal</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex.: Cidade/Estado"
                        value={clientInfo.location}
                        onChange={(e) => setClientInfo({ ...clientInfo, location: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Forma Jurídica</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex.: MEI, LTDA, EIRELI, SA, etc."
                        value={clientInfo.legal_form}
                        onChange={(e) => setClientInfo({ ...clientInfo, legal_form: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 mt-6">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Iniciar Diagnóstico
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 'calculating' && (
              <DiagnosticCalculator
                answers={answers}
                onComplete={handleCalculationComplete}
              />
            )}

            {step === 'questions' && currentGroup && (
              <div className="p-8">
                <div className="bg-gray-800/80 rounded-xl p-6 mb-8 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{currentGroupIndex + 1}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        {currentGroup.name}
                      </h2>
                    </div>
                    <span className="text-white/60 text-sm">
                      Pilar {currentGroupIndex + 1} de {groups.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-8">
                  {groupQuestions.map((question) => (
                    <div key={question.id} className="space-y-4">
                      <div>
                        <p className="text-xl font-medium text-white">
                          {question.number}. {question.text}
                        </p>
                      </div>

                      <div className="flex gap-4">
                        {question.answer_type === 'yes_no' ? (
                          ['yes', 'no'].map((value) => (
                            <button
                              key={value}
                              onClick={() => handleAnswer(question.id, value)}
                              className={`px-4 py-2 rounded-md transition-colors text-sm ${
                                answers[question.id] === value
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                            >
                              {value === 'yes' ? 'Sim' : 'Não'}
                            </button>
                          ))
                        ) : (
                          ['yes', 'partial', 'no'].map((value) => (
                            <button
                              key={value}
                              onClick={() => handleAnswer(question.id, value)}
                              className={`px-4 py-2 rounded-md transition-colors text-sm ${
                                answers[question.id] === value
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                            >
                              {value === 'yes' ? 'Sim' : value === 'partial' ? 'Às vezes' : 'Não'}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between mt-8">
                    <button
                      onClick={handlePreviousGroup}
                      disabled={currentGroupIndex === 0}
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        currentGroupIndex === 0
                          ? 'bg-white/5 text-white/20 cursor-not-allowed'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Anterior
                    </button>

                    {currentGroupIndex < groups.length - 1 ? (
                      <button
                        onClick={handleNextGroup}
                        disabled={!isCurrentGroupComplete}
                        className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                          isCurrentGroupComplete
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                      >
                        Próximo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    ) : (
                      <button
                        onClick={handleFinishDiagnostic}
                        disabled={!isCurrentGroupComplete}
                        className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                          isCurrentGroupComplete
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                      >
                        Finalizar
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Diagnostic() {
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  const handleStartDiagnostic = () => {
    setShowDiagnostic(true);
  };

  const handleCloseDiagnostic = () => {
    setShowDiagnostic(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Bem-vindo ao Diagnóstico Empresarial
        </h1>
        <button
          onClick={handleStartDiagnostic}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Iniciar Diagnóstico
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>

      {showDiagnostic && <DiagnosticModal onClose={handleCloseDiagnostic} />}
    </div>
  );
}