"use client";

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

export default function BackofficePage() {
  const { groups, questions, fetchGroups, fetchQuestions, addGroup, addQuestion } =
    useStore();

  useEffect(() => {
    fetchGroups();
    fetchQuestions();
  }, [fetchGroups, fetchQuestions]);

  const { register, handleSubmit, reset } = useForm();

  const onSubmitGroup = async (data: any) => {
    await addGroup(data.name);
    reset();
  };

  const onSubmitQuestion = async (data: any) => {
    await addQuestion({
      group_id: data.group_id,
      number: data.number,
      text: data.text,
      score_value: parseInt(data.score_value),
      score_type: data.score_type,
      order: questions.length,
    });
    reset();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Backoffice</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Grupos</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmitGroup)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Grupo</Label>
                <Input id="name" {...register('name')} required />
              </div>
              <Button type="submit">Adicionar Grupo</Button>
            </form>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Grupos Existentes</h3>
              <div className="space-y-2">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="p-2 bg-secondary rounded flex justify-between items-center"
                  >
                    <span>{group.name}</span>
                    <span className="text-sm text-muted-foreground">
                      Ordem: {group.order + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perguntas</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmitQuestion)} className="space-y-4">
              <div>
                <Label htmlFor="group_id">Grupo</Label>
                <Select {...register('group_id')} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="number">Número</Label>
                <Input id="number" {...register('number')} required />
              </div>

              <div>
                <Label htmlFor="text">Texto da Pergunta</Label>
                <Input id="text" {...register('text')} required />
              </div>

              <div>
                <Label htmlFor="score_value">Valor da Pontuação</Label>
                <Input
                  id="score_value"
                  type="number"
                  {...register('score_value')}
                  required
                />
              </div>

              <div>
                <Label htmlFor="score_type">Tipo de Pontuação</Label>
                <Select {...register('score_type')} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Completa</SelectItem>
                    <SelectItem value="half">Metade</SelectItem>
                    <SelectItem value="none">Nenhuma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit">Adicionar Pergunta</Button>
            </form>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Perguntas Existentes</h3>
              <div className="space-y-2">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="p-2 bg-secondary rounded"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{question.number}</span>
                      <span className="text-sm text-muted-foreground">
                        Pontuação: {question.score_value}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{question.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}