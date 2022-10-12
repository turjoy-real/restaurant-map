import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import app from "firebase/compat/app";
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
} from "native-base";
import React, { useReducer, useCallback } from "react";
import { Alert } from "react-native";

import InputUI from "../../../components/molecules/Input";
import { mobileSignIn } from "../../../store/actions/auth";
import { useAppDispatch } from "../../../store/selectors/hooks";

// An enum with all the types of actions to use in our reducer
enum InputActionKind {
  FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE",
}

// An interface for our actions
interface InputAction {
  type: InputActionKind;
  value: string;
  isValid: boolean;
  input: string;
}

// An interface for our state

interface InputValues {
  email: string;
  password: string;
}

interface InputValidities {
  email: boolean;
  password: boolean;
}
interface InputState {
  inputValues: InputValues;
  inputValidities: InputValidities;
  formIsValid: boolean;
}

const formReducer = (state: InputState, action: InputAction) => {
  if (action.type === InputActionKind.FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid =
        updatedFormIsValid && updatedValidities[key as keyof InputValidities];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

export default function LoginOne() {
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });
  const inputChangeHandler = useCallback(
    (inputIdentifier: any, inputValue: any, inputValidity: any) => {
      dispatchFormState({
        type: InputActionKind.FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const dispatch = useAppDispatch();
  async function handleSubmit() {
    if (formState.formIsValid) {
      try {
        // setIsLoading(false);
        interface Creds {
          email: string;
          password: string;
        }
        const creds: Creds = {
          email: formState.inputValues.email,
          password: formState.inputValues.password,
        };
        await dispatch(mobileSignIn(creds));
      } catch (err: any) {
        console.log(err);
      }
    } else {
      Alert.alert("Check Form", "Some fields are incorrect", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  }

  return (
    <Center>
      <Box m="10">
        <Stack alignItems="center" space={3}>
          <InputUI
            initialValue=""
            initiallyValid
            id="email"
            label="Email"
            onInputChange={inputChangeHandler}
            errorText="Type correct email"
            type="email"
          />
          <InputUI
            initialValue=""
            initiallyValid
            id="password"
            label="Password"
            onInputChange={inputChangeHandler}
            errorText="Not less than 5 letters"
            type="password"
          />
          <Button onPress={handleSubmit} m="10">
            Login
          </Button>
        </Stack>
      </Box>
    </Center>
  );
}
