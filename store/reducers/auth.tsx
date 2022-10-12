import { createSlice } from "@reduxjs/toolkit";

import { fetchUser, mobileSignIn, signOut } from "../actions/auth";

interface authSliceState {
  userId: string | null;
  token: string | null;
  error: boolean;
  errorMessage: string;
  status: string;
  email: string | null;
  didTryAutoLogin: boolean;
}

const initialState: authSliceState = {
  userId: null,
  token: null,
  error: false,
  errorMessage: "",
  status: "idle",
  email: null,
  didTryAutoLogin: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Fetch User
    builder
      .addCase(fetchUser.pending, (state: authSliceState, action: any) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state: authSliceState, action: any) => {
        state.status = "success";
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.email = action.payload.email ? action.payload.email : state.email;
        state.didTryAutoLogin = true;
      })
      .addCase(fetchUser.rejected, (state: authSliceState, action: any) => {
        state.status = "failed";
        state.error = action.payload.error.error;
        state.errorMessage = action.payload.error.errorMessage;
        state.didTryAutoLogin = false;
      })

      
      //SignIn
      .addCase(mobileSignIn.pending, (state: authSliceState, action: any) => {
        state.status = "loading";
      })
      .addCase(mobileSignIn.fulfilled, (state: authSliceState, action: any) => {
        state.status = "success";
        state.userId = action.payload.userId;
        state.token = action.payload.token;
      })
      .addCase(mobileSignIn.rejected, (state: authSliceState, action: any) => {
        state.status = "failed";
        state.error = action.payload.error;
        state.errorMessage = action.payload.errorMessage;
      })


      //Sign Out
      .addCase(signOut.pending, (state: authSliceState, action: any) => {
        state.status = "loading";
      })
      .addCase(signOut.fulfilled, (state: authSliceState, action: any) => {
        state.status = "success";
        state = initialState;
      })
      .addCase(signOut.rejected, (state: authSliceState, action: any) => {
        state.status = "failed";
        state.error = action.payload.error;
        state.errorMessage = action.payload.errorMessage;
      });
  },
});

export default authSlice.reducer;
