export interface Participant {
  id: string;
  user_id: string;
  name: string;
  university: string;
  email: string;
  graduation_year: number;
  skills: string[];
  project_idea?: string;
  ai_interests?: string[];
  created_at: string;
  updated_at: string;
}