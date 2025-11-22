export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface StepItem {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface ProblemCard {
  icon: string;
  title: string;
  description: string;
}

export interface SolutionCard {
  icon: string;
  title: string;
  description: string;
  color: string;
}
