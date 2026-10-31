import { createSlice } from '@reduxjs/toolkit';

const savedSession = JSON.parse(localStorage.getItem('agri_session')) || {
  isAuthenticated: false,
  user: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: savedSession,
  reducers: {
    login: (state, action) => {
      const { username, role } = action.payload;
      state.isAuthenticated = true;
      state.user = username;
      state.role = role;
      // Sahi tareeqa - sirf data save karo, pura state nahi
      localStorage.setItem('agri_session', JSON.stringify({
        isAuthenticated: true,
        user: username,
        role: role,
      }));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      localStorage.removeItem('agri_session');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;