import { createSlice } from '@reduxjs/toolkit';
const KEY = 'agri_attendance';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const save = (list) => localStorage.setItem(KEY, JSON.stringify(list));

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: { list: load() },
  reducers: {
    markAttendance: (state, action) => {
      const { workerId, workerName, date, status } = action.payload;
      state.list = state.list.filter(a => !(String(a.workerId)===String(workerId) && a.date===date));
      state.list.push({ id: Date.now().toString(), workerId: String(workerId), workerName, date, status });
      save(state.list);
    }
  }
});
export const { markAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;