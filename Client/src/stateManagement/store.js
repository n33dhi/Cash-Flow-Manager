import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../stateManagement/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
