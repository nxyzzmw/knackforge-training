import { createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
  name: "form",
  initialState: {
    data: [], 
  },
  reducers: {
    saveForm: (state, action) => {
      state.data.push(action.payload); 
    },

    clearForm: (state) => {
      state.data = []; 
    },

    deleteUser: (state, action) => {
      state.data = state.data.filter((_, index) => index !== action.payload);
    },
  },
});

export const { saveForm, clearForm, deleteUser } = formSlice.actions;
export default formSlice.reducer;
