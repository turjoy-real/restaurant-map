import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./reducers/auth";
const store = configureStore({
  reducer: {
    Auth: authSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
