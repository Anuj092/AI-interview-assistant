import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InterviewState } from '../types';

const initialState: InterviewState = {
  currentCandidate: null,
  currentQuestionIndex: 0,
  timeRemaining: 0,
  isActive: false,
  isPaused: false,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    startInterview: (state, action: PayloadAction<{ candidateId: string; timeLimit: number }>) => {
      state.isActive = true;
      state.isPaused = false;
      state.currentQuestionIndex = 0;
      state.timeRemaining = action.payload.timeLimit;
    },
    pauseInterview: (state) => {
      state.isPaused = true;
    },
    resumeInterview: (state) => {
      state.isPaused = false;
    },
    nextQuestion: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex += 1;
      state.timeRemaining = action.payload;
    },
    updateTimer: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    endInterview: (state) => {
      state.isActive = false;
      state.isPaused = false;
      state.currentQuestionIndex = 0;
      state.timeRemaining = 0;
    },
    resetInterview: (state) => {
      return initialState;
    },
  },
});

export const {
  startInterview,
  pauseInterview,
  resumeInterview,
  nextQuestion,
  updateTimer,
  endInterview,
  resetInterview,
} = interviewSlice.actions;

export default interviewSlice.reducer;