import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice.js';
import workersReducer from './reducers/workersSlice.js';
import attendanceReducer from './reducers/attendanceSlice.js';
import equipmentReducer from './reducers/equipmentSlice.js';
import maintenanceReducer from './reducers/maintenanceSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workers: workersReducer,
    attendance: attendanceReducer,
    equipment: equipmentReducer,
    maintenance: maintenanceReducer,
  },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
  devTools: true,
});