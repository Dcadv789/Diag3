/*
  # Initial Schema Setup for Assessment Application

  1. New Tables
    - `groups`
      - `id` (uuid, primary key)
      - `name` (text)
      - `order` (integer)
      - `created_at` (timestamp)
      
    - `questions`
      - `id` (uuid, primary key)
      - `group_id` (uuid, foreign key)
      - `number` (text) - e.g., "1.1", "5.5"
      - `text` (text)
      - `score_value` (integer)
      - `score_type` (text) - 'full', 'half', or 'none'
      - `order` (integer)
      - `created_at` (timestamp)
      
    - `assessments`
      - `id` (uuid, primary key)
      - `client_name` (text)
      - `company_name` (text)
      - `cnpj` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)
      
    - `assessment_answers`
      - `id` (uuid, primary key)
      - `assessment_id` (uuid, foreign key)
      - `question_id` (uuid, foreign key)
      - `answer` (text)
      - `score` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  number text NOT NULL,
  text text NOT NULL,
  score_value integer NOT NULL,
  score_type text CHECK (score_type IN ('full', 'half', 'none')) NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  company_name text NOT NULL,
  cnpj text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS assessment_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  answer text NOT NULL,
  score integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own groups"
  ON groups
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage questions in their groups"
  ON questions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM groups WHERE groups.id = questions.group_id AND groups.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their own assessments"
  ON assessments
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage answers for their assessments"
  ON assessment_answers
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM assessments WHERE assessments.id = assessment_answers.assessment_id AND assessments.user_id = auth.uid()
  ));