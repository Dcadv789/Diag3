import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ClipboardList, Settings, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12">Sistema de Diagnóstico</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Backoffice
              </CardTitle>
              <CardDescription>
                Configure grupos e perguntas do diagnóstico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/backoffice">
                <Button className="w-full">
                  Acessar Backoffice
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Diagnóstico
              </CardTitle>
              <CardDescription>
                Realize um novo diagnóstico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/diagnostico">
                <Button className="w-full">
                  Iniciar Diagnóstico
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Resultados
              </CardTitle>
              <CardDescription>
                Visualize e analise os resultados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/resultados">
                <Button className="w-full">
                  Ver Resultados
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}