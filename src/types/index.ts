// 学習フェーズの型
export type LearningPhase = 1 | 2 | 3;

// 問題の種類
export type ProblemType = 
  | 'bad_example_correction'  // 悪い例の添削
  | 'template_fill'           // テンプレート埋め込み
  | 'case_study'              // ケーススタディ作成
  | 'instruction_optimization' // 指示文最適化
  | 'image_description'       // 図表説明
  | 'complex_case'            // 複雑なケース作成

// 問題データの構造
export interface Problem {
  id: string;
  phase: LearningPhase;
  type: ProblemType;
  title: string;
  description: string;
  content: string;
  example?: string;
  template?: string;
  image?: string;
  hints?: string[];
  estimatedTime: number; // 分単位
}

// ユーザーの回答
export interface UserAnswer {
  id: string;
  problemId: string;
  answer: string;
  submittedAt: Date;
  feedback?: AIFeedback;
  isCompleted: boolean;
}

// AIフィードバック
export interface AIFeedback {
  overall_impression: string;
  detailed_feedback: DetailedFeedback[];
  improvement_suggestions: string[];
  next_recommendations: string[];
  score?: number; // 0-100のスコア
}

export interface DetailedFeedback {
  section: string;
  issue: string;
  improvement: string;
  reason: string;
}

// 学習進捗
export interface LearningProgress {
  phase1: number;
  phase2: number;
  phase3: number;
  totalProblems: number;
  completedProblems: number;
  averageScore: number;
}

// 言語化の癖分析
export interface LanguageHabits {
  id: string;
  analyzedAt: Date;
  patterns: HabitPattern[];
  recommendations: string[];
  improvementTrends: ImprovementTrend[];
}

export interface HabitPattern {
  type: 'ambiguous_expression' | 'delayed_conclusion' | 'redundant_phrases' | 'weak_structure' | 'unclear_purpose';
  frequency: number;
  examples: string[];
  suggestion: string;
}

export interface ImprovementTrend {
  metric: string;
  trend: 'improving' | 'stable' | 'declining';
  value: number;
  change: number;
}

// データエクスポート用
export interface ExportData {
  exportedAt: Date;
  version: string;
  answers: UserAnswer[];
  progress: LearningProgress;
  habits?: LanguageHabits;
}

// API リクエスト/レスポンス型
export interface FeedbackRequest {
  text: string;
  problem_type: string;
  phase: number;
}

export interface FeedbackResponse {
  overall_impression: string;
  detailed_feedback: Array<{
    section: string;
    issue: string;
    improvement: string;
    reason: string;
  }>;
  improvement_suggestions: string[];
  next_recommendations: string[];
} 