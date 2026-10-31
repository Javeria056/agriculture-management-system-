import { createSlice } from '@reduxjs/toolkit';
const MAIN_KEY = 'agri_maintenance';
const load = () => { try { return JSON.parse(localStorage.getItem(MAIN_KEY)) || []; } catch { return []; } };
const save = (list) => localStorage.setItem(MAIN_KEY, JSON.stringify(list));

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState: { list: load() },
  reducers: {
    addMaintenance: (state, action) => {
      state.list.push({ id: Date.now().toString(), ...action.payload, cost: Number(action.payload.cost) });
      save(state.list);
    }
  }
});
export const { addMaintenance } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;