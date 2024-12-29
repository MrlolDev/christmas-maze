export type Score = {
  id: string;
  score: {
    totalScore: number;
    mazeScores: number[];
  };
  created_at: Date;
  isTopScore: boolean;
  newScoreSystem: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  scores: Score[];
  banned?: boolean;
};
