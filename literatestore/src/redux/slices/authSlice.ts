import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loginLoading: false,
    logoutLoading: false,
  },
  reducers: {
    loginLoading: (state, action) => {
      state.loginLoading = action.payload
    },
    logoutLoading: (state, action) => {
      state.logoutLoading = action.payload
    },
  },
})

export const authActions = authSlice.actions
export default authSlice.reducer
