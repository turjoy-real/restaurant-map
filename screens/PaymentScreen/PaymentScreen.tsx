// import { Button } from 'native-base';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Box, Text, Button, Center, Flex } from "native-base";
import React from "react";
import { signOut } from "../../store/actions/auth";

import useAuthData from "../../store/selectors/auth";
import { useAppDispatch } from "../../store/selectors/hooks";

export default function PaymentScreen() {
  const { authState } = useAuthData();
  const handlePress = async () => {
    // console.log("auth stuff", authState);
  };
  const dispatch = useAppDispatch();
  return (
    <Flex>
      <Box>
        <Text>Payment Screen</Text>
        <Button onPress={() => dispatch(signOut())}>Sign out</Button>
      </Box>
    </Flex>
  );
}
