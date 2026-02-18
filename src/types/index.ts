export type ProfileAnswer =
  | "podatkovni"
  | "produktni"
  | "performance"
  | "ne_vem";

export interface FormData {
  name: string;
  lastname: string;
  email: string;
  answer: ProfileAnswer;
}

export interface Submission {
  id: string;
  name: string;
  lastname: string;
  email: string;
  answer: ProfileAnswer;
  created_at: string;
}

export interface ResultsDistribution {
  answer: ProfileAnswer;
  count: number;
  percentage: number;
  label: string;
}
