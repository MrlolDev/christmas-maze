export type Score = {
  id: string;
  score: number;
  created_at: Date;
  isTopScore: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  scores: Score[];
  banned?: boolean;
};
