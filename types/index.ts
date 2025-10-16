export interface Topic {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface Question {
  topicId: number;
  question: string;
  options: string[]; // Có thể không dùng, nhưng giữ lại cho đầy đủ
  correctAnswerIndex: number;
}

export interface QuizData {
  topics: Topic[];
  questions: Question[];
}

// Cập nhật trạng thái
export type QuizState = 'topics' | 'preview' | 'quiz' | 'win' | 'lose';