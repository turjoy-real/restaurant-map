import { createAsyncThunk } from "@reduxjs/toolkit";
import app from "firebase/compat/app";
import { Alert } from "react-native";


import { RootState } from "..";
import { get } from "../../APIs/helpers";
import { Error } from "../../types";

interface UserInit {
  userId: string | null;
  token: string | null;
}
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (obj: UserInit, { getState }) => {
    const { Auth } = getState() as RootState;
    const payload = { ...Auth };
    payload.userId = obj.userId;
    payload.token = obj.token;
    try {
      const resData = await get(`users/${payload.userId}`);
      if (resData) {
        payload.email = resData.email;
      }
      return payload;
    } catch (error: any) {
      const payload: Error = {
        error: true,
        errorMessage: error.message,
      };
      return payload;
    }
  }
);

interface SignInInput {
  email: string;
  password: string;
}

interface MobileRes {
  userId: string | undefined;
  token: string | undefined;
}

export const mobileSignIn = createAsyncThunk(
  "auth/mobileAuth",
  async (obj: SignInInput) => {
    const payload: MobileRes = {
      userId: "",
      token: "",
    };

    app
      .auth()
      .signInWithEmailAndPassword(obj.email, obj.password)
      .then(async (res) => {
        const userId = res?.user?.uid;
        const token = await res?.user?.getIdToken();

        payload.userId = userId;
        payload.token = token;
      })
      .catch((error) => {
        let alertTitle = "Network Error";
        let alertMessage =
          "Timeout, connection interruption etc. might have happened.";

        if (error.message === "EMAIL_NOT_FOUND") {
          alertTitle = "Email not found";
          alertMessage = "Try signing up with this email.";
        } else if (error.message === "INVALID_PASSWORD") {
          alertTitle = "Password Incorrect";
          alertMessage = "Try again with correct password.";
        }
        Alert.alert(alertTitle, alertMessage, [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);

        const payload: Error = {
          error: true,
          errorMessage: error.message,
        };

        return payload;
      });
    return payload;
  }
);


export const signOut = createAsyncThunk("auth/signOut", async () => {
  app
    .auth()
    .signOut()
    .then(() => {
      return null;
    })
    .catch((error) => {
      const payload: Error = {
        error: true,
        errorMessage: error.message,
      };
      return payload;
    });
});
