export interface Skill {
  skill_id: number;
  skill_name: string;
}

export interface VolunteerProfile {
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  date_of_birth?: string;
  gender?: string;
}

export interface User {
  user_id: number;
  email: string;
  role: 'volunteer' | 'organization';
  volunteer_profile?: VolunteerProfile;
  volunteer_skills?: { skill: Skill }[];
}

export interface QuestionOption {
  label: string;
  value: string;
}

export interface OpportunityQuestion {
  question_id: number;
  text: string;
  type: 'text' | 'yes_no' | 'checkbox' | 'file';
  required: boolean;
  options?: QuestionOption[];
  placeholder?: string;
}

export interface Opportunity {
  opp_id: number;
  title: string;
  description?: string;
  organization?: {
    org_id: number;
    name: string;
    description?: string;
  };
  questions?: OpportunityQuestion[];
  opportunity_skills?: { skill?: Skill }[];
}

export interface ApplicationAnswer {
  question_id: number;
  question_text: string;
  answer: string;
}

export interface ApplicationPayload {
  opp_id: number;
  answers: ApplicationAnswer[];
}

export interface ApplicationFormProps {
  opportunity: Opportunity;
  user: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}
