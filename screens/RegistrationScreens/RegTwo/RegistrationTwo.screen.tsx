import {
  Button,
  Heading,
  HStack,
  Input,
  Spinner,
  Stack,
  Text,
  Box,
} from "native-base";
import React, { useState } from "react";

import SalaryCalcLogic, {
  options,
} from "../../../components/organisms/salaryCalcLogic";

import { updateCompanyProfile } from "../../../store/actions/companyProfile";
import useAuthData from "../../../store/selectors/auth";
import { useAppDispatch } from "../../../store/selectors/hooks";

export default function RegTwo() {
  const { status, currentCompany } = useAuthData();

  const dispatch = useAppDispatch();

  const [salaryCalcLogic, setSalaryCalcLogic] = useState(options[0]);
  const [inputHours, setInputHours] = useState("");

  const handleChange = (text: string) => setInputHours(text);

  async function submitHandler() {
    try {
      const CompanyDetails = {
        data: {
          salaryCalcLogic,
          inputHours,
        },
        id: currentCompany ? currentCompany : "",
      };
      await dispatch(updateCompanyProfile(CompanyDetails));
    } catch (err: any) {
      // console.log(err.message);
      // setIsLoading(false);
    }
  }

  return status === "loading" ? (
    <HStack space={2} alignItems="center">
      <Spinner accessibilityLabel="Loading posts" />
      <Heading color="primary.500" fontSize="md">
        Loading
      </Heading>
    </HStack>
  ) : (
    <Stack alignItems="center" space={3}>
      <Text bold>ABC</Text>
    </Stack>
  );
}
