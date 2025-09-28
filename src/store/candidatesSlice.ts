import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Candidate } from '../types';

interface CandidatesState {
  list: Candidate[];
  selectedCandidate: Candidate | null;
}

const initialState: CandidatesState = {
  list: [],
  selectedCandidate: null,
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      state.list.push(action.payload);
    },
    updateCandidate: (state, action: PayloadAction<Candidate>) => {
      const index = state.list.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    selectCandidate: (state, action: PayloadAction<string>) => {
      state.selectedCandidate = state.list.find(c => c.id === action.payload) || null;
    },
    clearSelection: (state) => {
      state.selectedCandidate = null;
    },
  },
});

export const { addCandidate, updateCandidate, selectCandidate, clearSelection } = candidatesSlice.actions;
export default candidatesSlice.reducer;