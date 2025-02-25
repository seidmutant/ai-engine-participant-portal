/*
  # Hackathon Participants Schema

  1. New Tables
    - `participants`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `university` (text)
      - `email` (text)
      - `graduation_year` (integer)
      - `skills` (text[])
      - `project_idea` (text, nullable)
      - `ai_interests` (text[], nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on participants table
    - Add policies for:
      - Users can read all participants
      - Users can only update their own profile
*/

CREATE TABLE participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  university text NOT NULL,
  email text NOT NULL,
  graduation_year integer NOT NULL,
  skills text[] NOT NULL DEFAULT '{}',
  project_idea text,
  ai_interests text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read all participants
CREATE POLICY "Users can view all participants"
  ON participants
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to update only their own profile
CREATE POLICY "Users can update own profile"
  ON participants
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON participants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);