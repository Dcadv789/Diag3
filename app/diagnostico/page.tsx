"use client";

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';

export default function DiagnosticoPage() {
  const [step, setStep] = useState(0);
  const { groups, questions, addAssessment } = useStore();
  const { register, handleSubmit } = useForm();

  const onSubmitInfo = async (data: any) => {
    setStep(1);
    window.sessionStorage.setItem('clientInfo', JSON.stringify(data));
  };

  const onSubmitAnswers = async (data: any) => {
    const clientInfo = JSON.parse(window.sessionStorage.getItem('clientInfo') || '{}');
    
    const answers = Object.entries(data).map(([question_id, answer]) => ({
      question_id,
      answer,
      score: answer === 'yes' ? 1 : answer === 'partial' ? 0.5 : 0,
    }));

    addAssessment({
      ...clientInfo,
      answers,
    });

    setStep(2);
  };

  if (step === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmitInfo)} className="space-y-4">
              <div>
                <Label htmlFor="client_name">Nome do Cliente</Label>
                <Input id="client_name" {...register('client_name')} required />
              </div>

              <div>
                <Label htmlFor="company_name">Nome da Empresa</Label>
                <Input id="company_name" {...register('company_name')} required />
              </div>

              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" {...register('cnpj')} required />
              </div>

              <Button type="submit">Iniciar Diagnóstico</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmitAnswers)} className="space-y-6">
              {questions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <Label>
                    {question.number}. {question.text}
                  </Label>
                  <Select {...register(question.id)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma resposta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Sim</SelectItem>
                      <SelectItem value="partial">Parcialmente</SelectItem>
                      <SelectItem value="no">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}

              <Button type="submit">Finalizar Diagnóstico</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Diagnóstico Concluído!</h2>
      <p className="mb-4">
        Obrigado por completar o diagnóstico. Você pode visualizar os resultados
        na seção de Resultados.
      </p>
      <Button onClick={() => window.location.href = '/resultados'}>
        Ver Resultados
      </Button>
    </div>
  );
}