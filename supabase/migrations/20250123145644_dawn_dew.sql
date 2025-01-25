/*
  # Schema inicial do sistema de diagnóstico

  1. Novas Tabelas
    - `question_groups`: Grupos de perguntas
      - `id` (serial, primary key)
      - `name` (text)
      - `order` (integer)
    
    - `questions`: Perguntas do diagnóstico
      - `id` (uuid, primary key)
      - `group_id` (integer, foreign key)
      - `number` (text)
      - `text` (text)
      - `points` (integer)
      - `score_type` (text)
    
    - `clients`: Informações dos clientes
      - `id` (uuid, primary key)
      - `name` (text)
      - `company` (text)
      - `cnpj` (text)
    
    - `diagnostics`: Diagnósticos realizados
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key)
      - `answers` (jsonb)
      - `total_score` (integer)
      - `created_at` (timestamptz)

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas de acesso para usuários autenticados
*/

-- Criação das tabelas
CREATE TABLE question_groups (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id INTEGER REFERENCES question_groups(id),
  number TEXT NOT NULL,
  text TEXT NOT NULL,
  points INTEGER NOT NULL,
  score_type TEXT CHECK (score_type IN ('full', 'half', 'none')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  answers JSONB NOT NULL,
  total_score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE question_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Permitir leitura para usuários autenticados"
  ON question_groups
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir leitura para usuários autenticados"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir leitura para usuários autenticados"
  ON clients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir leitura para usuários autenticados"
  ON diagnostics
  FOR SELECT
  TO authenticated
  USING (true);