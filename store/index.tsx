import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./reducers/auth";
import { profileSlice } from "./reducers/companyProfile";
const store = configureStore({
  reducer: {
    Auth: authSlice.reducer,
    Company: profileSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
