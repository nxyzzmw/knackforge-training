import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AuthState, Tokens } from "../types/authTypes";


const initialState: AuthState = {

  accessToken: null,

  refreshToken: null,

  isAuthenticated: false,

};


const authSlice = createSlice({

  name: "auth",

  initialState,

  reducers: {

    setTokens:

      (state, action: PayloadAction<Tokens>) => {


      state.accessToken =

        action.payload.accessToken;


      state.refreshToken =

        action.payload.refreshToken;


      state.isAuthenticated = true;

    },


    logout: (state) => {

      state.accessToken = null;

      state.refreshToken = null;

      state.isAuthenticated = false;

    },

  },

});


export const { setTokens, logout }

= authSlice.actions;


export default authSlice.reducer;
