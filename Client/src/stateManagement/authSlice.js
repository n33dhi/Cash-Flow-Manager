import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  role: '' ,
  email: '',
  name: ''
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    clearUserData: (state) => {
      return initialState;
    }
  },
});

export const { setUserData, clearUserData } = authSlice.actions;

export const setTokenData = (token) => (dispatch) => {
  if (!token) {
    return;
  }

  try {
    const decodedToken = jwtDecode(token);
    const userData = {
      role: decodedToken.Role || '',
      email: decodedToken.Email || '',
      name: decodedToken.UserName || ''
    };
    // console.log(userData);
    dispatch(setUserData(userData));
  } catch (error) {
    console.error('Error decoding token:', error);
  }
};

export default authSlice.reducer;
