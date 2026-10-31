import { createSlice } from '@reduxjs/toolkit';
const EQ_KEY = 'agri_equipment';
const load = () => { try { return JSON.parse(localStorage.getItem(EQ_KEY)) || []; } catch { return []; } };
const save = (list) => localStorage.setItem(EQ_KEY, JSON.stringify(list));

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState: { equipments: load() },
  reducers: {
    addEquipment: (state, action) => {
      state.equipments.push({ id: Date.now().toString(), ...action.payload });
      save(state.equipments);
    },
    removeEquipment: (state, action) => {
      state.equipments = state.equipments.filter(e => e.id !== action.payload);
      save(state.equipments);
    }
  }
});
export const { addEquipment, removeEquipment } = equipmentSlice.actions;
export default equipmentSlice.reducer;