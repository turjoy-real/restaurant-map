import { createSlice } from "@reduxjs/toolkit";

// eslint-disable-next-line import/order
import { Error } from "../../types";
import { fetchProfile, updateCompanyProfile } from "../actions/companyProfile";

interface profileSliceState {
  data: object | null;
  status: string;
  id: string | null;
  error: Error | null;
}

// Define the initial state using that type
const initialState: profileSliceState = {
  data: null,
  status: "idle",
  id: null,
  error: null,
};

export const profileSlice = createSlice({
  name: "company",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchProfile.pending, (state: any, action: any) => {
      state.status = "loading";
    });
    builder.addCase(fetchProfile.fulfilled, (state: any, action: any) => {
      // console.log(action.payload);
      state.status = "success";
      state.id = action.payload.id;
      state.data = { ...state.data, ...action.payload.data };
    });
    builder.addCase(fetchProfile.rejected, (state: any, action: any) => {
      state.status = "failed";
      state.error = action.payload.message;
    });

    // Update Company Profile
    builder.addCase(
      updateCompanyProfile.pending,
      (state: profileSliceState, action: any) => {
        state.status = "loading";
      }
    );
    builder.addCase(
      updateCompanyProfile.fulfilled,
      (state: profileSliceState, action: any) => {
        state.status = "success";
        state.id = action.payload.id;
        state.data = { ...state.data, ...action.payload.data };
      }
    );
    builder.addCase(
      updateCompanyProfile.rejected,
      (state: profileSliceState, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      }
    );
  },
});

export const {} = profileSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export default profileSlice.reducer;
