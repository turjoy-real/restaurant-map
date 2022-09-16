import { createAsyncThunk } from "@reduxjs/toolkit";
import app from "firebase/compat/app";

import { RootState } from "..";
import { get } from "../../APIs/helpers";
import { Error } from "../../types";
import { Company } from "../types";

interface Payload {
  companiesOwned: Company[];
  employedBy: Company[];
  userId: string | null;
  token: string | null;
  email: string | null;
  mobile: string | null;
  fullName: string | null;
  currentCompany: string | null;
}

interface UserInit {
  userId: string;
  token: string;
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
        payload.companiesOwned = resData.companiesOwned;
        payload.employedBy = resData.employedBy ? resData.employedBy : [];
        payload.mobile = resData.mobile;
        payload.fullName = resData.fullName;
        payload.currentCompany = resData.employedBy[0].companyId;
      }
      // console.log("fetch res", resData, "payload", payload);
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

interface OTPReq {
  phoneNumber: string;
  appVerifier: any;
}

export const requestPhoneOtpDevice = createAsyncThunk(
  "auth/reqOTP",
  async (obj: OTPReq) => {
    const phoneProvider = new app.auth.PhoneAuthProvider();

    try {
      const verificationId: any = await phoneProvider.verifyPhoneNumber(
        obj.phoneNumber,
        obj.appVerifier
      );

      // console.log("====================================");
      // console.log(obj);
      // console.log("====================================");
      const res = await verificationId;

      // console.log("req", res);
      const payload = {
        mobile: obj.phoneNumber,
        verificationId,
      };

      // console.log("reqOtp", payload);
      return payload;
    } catch (error: any) {
      const payload: Error = {
        error: true,
        errorMessage: error.message,
      };
      // console.log("reqOtp", payload);
      return payload;
    }
  }
);

interface SignInInput {
  verificationId: any;
  code: any;
}

interface MobileRes {
  userId: string | undefined;
  token: string | undefined;
}

export const mobileSignIn = createAsyncThunk(
  "auth/mobileAuth",
  async (obj: SignInInput) => {
    const credential = app.auth.PhoneAuthProvider.credential(
      obj.verificationId,
      obj.code
    );
    const payload: MobileRes = {
      userId: "",
      token: "",
    };

    // console.log("obj", obj, credential);

    app
      .auth()
      .signInWithCredential(credential)
      .then(async (res) => {
        const userId = res?.user?.uid;
        const token = await res?.user?.getIdToken();

        payload.userId = userId;
        payload.token = token;

        // console.log("====================================");
        // console.log(res.user);
        // console.log("====================================");
      })
      .catch((error: any) => {
        const payload: Error = {
          error: true,
          errorMessage: error.message,
        };

        // console.log("payload err", payload, error);

        return payload;
      });
    // console.log("payload123", payload);
    return payload;
  }
);

interface User {
  userId: string | null;
  mobile: string | null;
  fullName: string;
  email: string;
  channelId: string;
  companyName: string;
  pushToken: string;
  createdAt: string;
}
export const createUser = createAsyncThunk(
  "auth/createUser",
  async (obj: User) => {
    // console.log("user", obj);
    try {
      const response = await fetch(
        "https://gst-gps-backend-2.vercel.app/api/v1/create_user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ regData: obj }),
        }
      );

      const resData = await response.json();

      const payload = {
        ...obj,
        companiesOwned: [
          { companyId: resData.companyId, companyName: obj.companyName },
        ],
      };

      // console.log("user2", payload);
      return payload;
    } catch (error: any) {
      const payload: Error = {
        error: true,
        errorMessage: error.message,
      };
      app.auth().signOut();
      return payload;
    }
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
