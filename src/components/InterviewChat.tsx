import React, { useState, useEffect, useCallback } from 'react';
import { Card, Input, Button, Progress, Typography, Space, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { nextQuestion, updateTimer, endInterview } from '../store/interviewSlice';
import { updateCandidate } from '../store/candidatesSlice';
import { AIService } from '../utils/aiService';
import { Answer, Candidate } from '../types';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface InterviewChatProps {
  candidate: Candidate;
}

const InterviewChat: React.FC<InterviewChatProps> = ({ candidate: initialCandidate }) => {
  const dispatch = useDispatch();
  const { currentQuestionIndex, timeRemaining, isActive } = useSelector((state: RootState) => state.interview);
  const candidates = useSelector((state: RootState) => state.candidates.list);
  
  // Get the latest candidate data from Redux store
  const candidate = candidates.find(c => c.id === initialCandidate.id) || initialCandidate;
  
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questions] = useState(() => Array.from({ length: 6 }, (_, i) => AIService.generateQuestion(i)));
  
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      dispatch(updateTimer(timeRemaining - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isActive, dispatch]);

  useEffect(() => {
    if (timeRemaining === 0 && isActive) {
      handleSubmitAnswer();
    }
  }, [timeRemaining, isActive]);

  const handleSubmitAnswer = useCallback(async () => {
    const timeSpent = currentQuestion.timeLimit - timeRemaining;
    const score = await AIService.scoreAnswer(
      currentQuestion.text,
      currentAnswer,
      timeSpent,
      currentQuestion.timeLimit
    );

    const answer: Answer = {
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      answer: currentAnswer,
      timeSpent,
      maxTime: currentQuestion.timeLimit,
      difficulty: currentQuestion.difficulty,
      score
    };

    const updatedAnswers = [...candidate.answers, answer];
    
    if (isLastQuestion) {
      const { score: finalScore, summary } = await AIService.generateFinalSummary(updatedAnswers);
      
      const updatedCandidate: Candidate = {
        ...candidate,
        answers: updatedAnswers,
        score: finalScore,
        summary,
        status: 'completed',
        completedAt: new Date().toISOString()
      };
      
      dispatch(updateCandidate(updatedCandidate));
      dispatch(endInterview());
      message.success('Interview completed! Thank you for your time.');
    } else {
      const updatedCandidate: Candidate = {
        ...candidate,
        answers: updatedAnswers
      };
      dispatch(updateCandidate(updatedCandidate));
      dispatch(nextQuestion(questions[currentQuestionIndex + 1].timeLimit));
      setCurrentAnswer('');
    }
  }, [candidate, currentQuestion, currentAnswer, timeRemaining, isLastQuestion, currentQuestionIndex, questions, dispatch]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercent = () => {
    return ((currentQuestion.timeLimit - timeRemaining) / currentQuestion.timeLimit) * 100;
  };

  if (!isActive) {
    return (
      <Card style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <Title level={3}>Interview Completed!</Title>
        <Text>Thank you for completing the interview. Your responses have been recorded.</Text>
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div style={{ textAlign: 'center' }}>
            <Title level={4}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Title>
            <Text type="secondary">
              Difficulty: {currentQuestion.difficulty.toUpperCase()}
            </Text>
          </div>

          <Card type="inner">
            <Text style={{ fontSize: 16 }}>{currentQuestion.text}</Text>
          </Card>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>Time Remaining: {formatTime(timeRemaining)}</Text>
              <Text type="secondary">
                {currentQuestion.difficulty === 'easy' ? '20s' : 
                 currentQuestion.difficulty === 'medium' ? '60s' : '120s'}
              </Text>
            </div>
            <Progress 
              percent={getProgressPercent()} 
              status={timeRemaining < 10 ? 'exception' : 'active'}
              showInfo={false}
            />
          </div>

          <TextArea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here..."
            rows={6}
            disabled={timeRemaining === 0}
          />

          <Button
            type="primary"
            size="large"
            onClick={handleSubmitAnswer}
            disabled={!currentAnswer.trim()}
            block
          >
            {isLastQuestion ? 'Complete Interview' : 'Submit & Next Question'}
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default InterviewChat;