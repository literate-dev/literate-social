import { createSlice } from '@reduxjs/toolkit'

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    show: false,
    title: "",
    modalDetails: {}
  },
  reducers: {
    showModal: (state, action) => {
      state.show = true
      state.title = action.payload.title,
      state.modalDetails = action.payload.modalDetails
    },
    hideModal: (state) => {
      state.show = false
      state.title = ""
    },
  },
})

export const modalActions = modalSlice.actions
export default modalSlice.reducer
