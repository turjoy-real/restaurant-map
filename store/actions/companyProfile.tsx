import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "..";
import { get, patch } from "../../APIs/helpers";
import { Error } from "../../types";

export const fetchProfile = createAsyncThunk(
  "company/fetchProfile",
  async (_, { getState }) => {
    const { Auth } = getState() as RootState;
    try {
      const response = await get(`companies/${Auth.currentCompany}`);
      // console.log("cm res", response);
      const payload = {
        id: Auth.currentCompany,
        data: response,
      };
      //pbc-dev-2022-default-rtdb.asia-southeast1.firebasedatabase.app/companies/-N8gcc3ZCLI4cnp4ykKp/salarySettings
      return payload;
    } catch (error) {
      return error;
    }
  }
);

interface CompanyPatch {
  data: object;
  id: string;
}

export const updateCompanyProfile = createAsyncThunk(
  "company/create",
  async (obj: CompanyPatch) => {
    try {
      await patch("companies", obj.data, obj.id);
      return obj;
    } catch (error: any) {
      const payload: Error = {
        error: true,
        errorMessage: error.message,
      };

      return payload;
    }
  }
);
