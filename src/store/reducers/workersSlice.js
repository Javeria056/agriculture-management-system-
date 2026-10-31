import { createSlice } from '@reduxjs/toolkit';
const KEY = 'agri_workers';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const save = (list) => localStorage.setItem(KEY, JSON.stringify(list));

const workersSlice = createSlice({
  name: 'workers',
  initialState: { workers: load() },
  reducers: {
    addWorker: (state, action) => {
      state.workers.push({
        id: Date.now().toString(),
        fullName: action.payload.fullName,
        name: action.payload.fullName,
        dailyWage: Number(action.payload.dailyWage),
        contact: action.payload.contact || '',
      });
      save(state.workers);
    },
    deleteWorker: (state, action) => {
      state.workers = state.workers.filter(w => w.id !== action.payload);
      save(state.workers);
    },
    clearAllWorkers: (state) => {
      state.workers = [];
      localStorage.removeItem(KEY);
      localStorage.removeItem('agri_attendance');
    }
  }
});
export const { addWorker, deleteWorker, clearAllWorkers } = workersSlice.actions;
export default workersSlice.reducer;