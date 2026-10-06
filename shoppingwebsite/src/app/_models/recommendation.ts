export interface Recommendation {
  rank: number;
  productid: string;
  title: string;
  category: string;
  price: number;
  imageurl: string | null;
  relevanceScore: number | null;
  modelScore: number;
  reason: string;
  source: 'llm' | 'model';
}

export interface RecommendationResponse {
  email: string;
  llmProvider: string;
  llmModel: string;
  llmUsed: boolean;
  recommendations: Recommendation[];
}
