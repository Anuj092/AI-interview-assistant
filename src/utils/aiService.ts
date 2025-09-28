import { Question, Answer } from '../types';

// Mock AI service - replace with actual AI API calls
export class AIService {
  private static questions: Question[] = [
    // Easy questions
    { id: 1, text: "What is React and what are its main benefits?", difficulty: 'easy', timeLimit: 20 },
    { id: 2, text: "Explain the difference between let, const, and var in JavaScript.", difficulty: 'easy', timeLimit: 20 },
    
    // Medium questions
    { id: 3, text: "How do React hooks work and what problem do they solve?", difficulty: 'medium', timeLimit: 60 },
    { id: 4, text: "Explain the concept of middleware in Express.js and provide an example.", difficulty: 'medium', timeLimit: 60 },
    
    // Hard questions
    { id: 5, text: "Design a scalable architecture for a real-time chat application using React and Node.js.", difficulty: 'hard', timeLimit: 120 },
    { id: 6, text: "How would you optimize a React application for performance? Discuss specific techniques.", difficulty: 'hard', timeLimit: 120 },
  ];

  static generateQuestion(index: number): Question {
    return this.questions[index] || this.questions[0];
  }

  static async scoreAnswer(question: string, answer: string, timeSpent: number, maxTime: number): Promise<number> {
    // Mock scoring logic - replace with actual AI scoring
    const timeRatio = timeSpent / maxTime;
    const lengthScore = Math.min(answer.length / 100, 1);
    const baseScore = lengthScore * 0.7 + (1 - timeRatio) * 0.3;
    
    // Add some randomness to simulate AI scoring
    const randomFactor = 0.8 + Math.random() * 0.4;
    return Math.round(Math.min(baseScore * randomFactor * 100, 100));
  }

  static async generateFinalSummary(answers: Answer[]): Promise<{ score: number; summary: string }> {
    const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
    const averageScore = Math.round(totalScore / answers.length);

    let summary = '';
    if (averageScore >= 80) {
      summary = 'Excellent candidate with strong technical knowledge and good communication skills.';
    } else if (averageScore >= 60) {
      summary = 'Good candidate with solid understanding of concepts, some areas for improvement.';
    } else if (averageScore >= 40) {
      summary = 'Average candidate with basic knowledge, needs significant development.';
    } else {
      summary = 'Candidate needs substantial improvement in technical skills and knowledge.';
    }

    return { score: averageScore, summary };
  }
}