import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Pencil, Check, X } from 'lucide-react';
import { useStore } from '../lib/store';

export default function Backoffice() {
  const { 
    groups, 
    questions, 
    fetchGroups, 
    fetchQuestions, 
    addGroup, 
    updateGroup,
    deleteGroup,
    addQuestion,
    updateQuestion,
    deleteQuestion
  } = useStore();
  
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups();
    fetchQuestions();
  }, [fetchGroups, fetchQuestions]);

  const handleAddGroup = () => {
    if (groups.length >= 5) {
      alert('Máximo de 5 pilares atingido.');
      return;
    }

    const groupNumber = groups.length + 1;
    addGroup(`Pilar ${groupNumber}`);
  };

  const handleUpdateGroup = (groupId: string, updates: { name: string }) => {
    updateGroup(groupId, updates);
    setEditingGroup(null);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este pilar?')) {
      deleteGroup(groupId);
      
      groups
        .filter(g => g.id !== groupId)
        .forEach((group, index) => {
          updateGroup(group.id, { order: index });
        });
    }
  };

  const handleAddQuestion = (groupId: string) => {
    const groupQuestions = questions.filter(q => q.group_id === groupId);
    
    if (groupQuestions.length >= 5) {
      alert('Este pilar já possui o máximo de 5 perguntas.');
      return;
    }

    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    const groupNumber = group.order + 1;
    const questionNumber = groupQuestions.length + 1;
    
    addQuestion({
      group_id: groupId,
      number: `${groupNumber}.${questionNumber}`,
      text: `Nova Pergunta ${groupNumber}.${questionNumber}`,
      score_value: 10,
      score_type: 'full',
      answer_type: 'yes_partial_no',
      order: questionNumber - 1
    });
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<Question>) => {
    updateQuestion(questionId, updates);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (questionId: string, groupId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      deleteQuestion(questionId);
      
      const groupQuestions = questions
        .filter(q => q.group_id === groupId && q.id !== questionId)
        .sort((a, b) => a.order - b.order);

      const group = groups.find(g => g.id === groupId);
      if (!group) return;

      groupQuestions.forEach((question, index) => {
        updateQuestion(question.id, {
          number: `${group.order + 1}.${index + 1}`,
          order: index
        });
      });
    }
  };

  const sortedGroups = [...groups].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Backoffice</h1>
        <button 
          onClick={handleAddGroup}
          className="flex items-center px-3 py-2 bg-green-600 rounded-md hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Pilar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sortedGroups.map((group) => {
          const groupNumber = group.order + 1;
          const groupQuestions = questions
            .filter(q => q.group_id === group.id)
            .sort((a, b) => a.order - b.order);

          return (
            <div key={group.id} className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                {editingGroup === group.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xl font-semibold">{groupNumber}.</span>
                    <input
                      type="text"
                      value={group.name}
                      onChange={(e) => updateGroup(group.id, { name: e.target.value })}
                      className="flex-1 px-3 py-1 bg-gray-700 rounded border border-gray-600"
                    />
                    <button
                      onClick={() => handleUpdateGroup(group.id, { name: group.name })}
                      className="p-2 text-green-400 hover:text-green-300"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setEditingGroup(null)}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold flex items-center gap-4">
                      <span>{groupNumber}. {group.name}</span>
                      <button
                        onClick={() => setEditingGroup(group.id)}
                        className="p-1 text-blue-400 hover:text-blue-300"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddQuestion(group.id)}
                        className="flex items-center px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-700 text-sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Pergunta
                      </button>
                      <button 
                        onClick={() => handleDeleteGroup(group.id)}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-4">
                {groupQuestions.map((question) => (
                  <div key={question.id} className="bg-gray-700 rounded-lg p-4">
                    {editingQuestion === question.id ? (
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="font-medium">{question.number}</span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdateQuestion(question.id, question)}
                              className="p-1 text-green-400 hover:text-green-300"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingQuestion(null)}
                              className="p-1 text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Pergunta</label>
                          <input
                            type="text"
                            value={question.text}
                            onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-600 rounded border border-gray-500"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Pontos</label>
                            <input
                              type="number"
                              value={question.score_value}
                              onChange={(e) => updateQuestion(question.id, { score_value: parseInt(e.target.value) })}
                              min="0"
                              className="w-full px-3 py-2 bg-gray-600 rounded border border-gray-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Soma</label>
                            <select
                              value={question.score_type}
                              onChange={(e) => updateQuestion(question.id, { 
                                score_type: e.target.value as 'full' | 'half' | 'none'
                              })}
                              className="w-full px-3 py-2 bg-gray-600 rounded border border-gray-500"
                            >
                              <option value="full">Sim</option>
                              <option value="half">Em partes</option>
                              <option value="none">Não</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Tipo de Resposta</label>
                            <select
                              value={question.answer_type}
                              onChange={(e) => updateQuestion(question.id, { 
                                answer_type: e.target.value as 'yes_no' | 'yes_partial_no'
                              })}
                              className="w-full px-3 py-2 bg-gray-600 rounded border border-gray-500"
                            >
                              <option value="yes_partial_no">Sim, Em partes, Não</option>
                              <option value="yes_no">Sim, Não</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{question.number}</span>
                            <span className="text-sm text-gray-400">
                              ({question.score_value} pontos)
                            </span>
                          </div>
                          <p className="text-gray-300 mt-1">{question.text}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-400">
                            <p>
                              Soma: {question.score_type === 'full' ? 'Sim' : 
                                    question.score_type === 'half' ? 'Em partes' : 
                                    'Não'}
                            </p>
                            <p>
                              Respostas: {question.answer_type === 'yes_partial_no' ? 
                                'Sim, Em partes, Não' : 'Sim, Não'}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => setEditingQuestion(question.id)}
                            className="p-1 text-blue-400 hover:text-blue-300"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteQuestion(question.id, group.id)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {groupQuestions.length === 0 && (
                  <p className="text-gray-400 text-center py-4">
                    Nenhuma pergunta neste pilar ainda.
                  </p>
                )}
              </div>
            </div>
          );
        })}
        {groups.length === 0 && (
          <div className="text-center py-8 bg-gray-800 rounded-lg">
            <p className="text-gray-400">Nenhum pilar criado ainda.</p>
            <p className="text-gray-400 text-sm mt-2">
              Clique em "Novo Pilar" para começar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}