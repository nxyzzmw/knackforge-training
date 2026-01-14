import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import formReducer from "./formSlice";
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    form: formReducer
  },
});
