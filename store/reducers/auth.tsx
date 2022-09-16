import { createSlice } from "@reduxjs/toolkit";

import {
  fetchUser,
  requestPhoneOtpDevice,
  mobileSignIn,
  createUser,
  signOut,
} from "../actions/auth";
import { Company } from "../types";
// Define a type for the slice state

interface authSliceState {
  companiesOwned: Company[];
  employedBy: Company[];
  userId: string | null;
  token: string | null;
  expiryTime: string;
  error: boolean;
  errorMessage: string;
  status: string;
  email: string | null;
  mobile: string | null;
  authState: boolean;
  lang: string;
  verificationId: any | null;
  didTryAutoLogin: boolean;
  pushToken: string;
  currentCompany: string | null;
  fullName: string | null;
}

// Define the initial state using that type
const initialState: authSliceState = {
  companiesOwned: [],
  employedBy: [],
  userId: null,
  token: null,
  expiryTime: "",
  error: false,
  errorMessage: "",
  status: "idle",
  email: null,
  mobile: null,
  authState: false,
  lang: "en",
  verificationId: null,
  didTryAutoLogin: false,
  pushToken: "",
  currentCompany: null,
  fullName: null,
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
        // // console.log('in reducer', action.payload);
        // const email = action.payload.email;
        // console.log('in reducer', action, 'email', email, 'payload', action.payload);
        state.status = "success";
        state.companiesOwned = action.payload.companiesOwned
          ? action.payload.companiesOwned
          : state.companiesOwned;
        state.employedBy = action.payload.employedBy
          ? action.payload.employedBy
          : state.employedBy;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.currentCompany = action.payload.currentCompany
          ? action.payload.currentCompany
          : state.currentCompany;
        state.email = action.payload.email ? action.payload.email : state.email;
        state.mobile = action.payload.mobile
          ? action.payload.mobile
          : state.mobile;
        state.fullName = action.payload.fullName
          ? action.payload.fullName
          : state.fullName;
        state.didTryAutoLogin = true;
      })
      .addCase(fetchUser.rejected, (state: authSliceState, action: any) => {
        // console.log("in reducer3", action);
        state.status = "failed";
        state.error = action.payload.error.error;
        state.errorMessage = action.payload.error.errorMessage;
        state.didTryAutoLogin = true;
      })

      // Request OTP
      .addCase(
        requestPhoneOtpDevice.pending,
        (state: authSliceState, action: any) => {
          state.status = "loading";
        }
      )
      .addCase(
        requestPhoneOtpDevice.fulfilled,
        (state: authSliceState, action: any) => {
          // console.log("in reducer 2", action);
          state.status = "success";
          state.verificationId = action.payload.verificationId;
          state.mobile = action.payload.mobile;
        }
      )
      .addCase(
        requestPhoneOtpDevice.rejected,
        (state: authSliceState, action: any) => {
          state.status = "failed";
          state.error = action.payload.error;
          state.errorMessage = action.payload.errorMessage;
        }
      )

      //OTP received
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

      //Create Company and add User to database
      .addCase(createUser.pending, (state: authSliceState, action: any) => {
        state.status = "loading";
      })
      .addCase(createUser.fulfilled, (state: authSliceState, action: any) => {
        state.status = "success";
        state.companiesOwned = action.payload.companiesOwned;
        state.email = action.payload.email;
        state.mobile = action.payload.mobile;
        state.currentCompany = action.payload.companiesOwned[0].companyId;
        state.fullName = action.payload.fullName;
      })
      .addCase(createUser.rejected, (state: authSliceState, action: any) => {
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

// export const {} = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export default authSlice.reducer;
