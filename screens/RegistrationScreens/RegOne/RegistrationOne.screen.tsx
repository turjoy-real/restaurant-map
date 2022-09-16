import app from "firebase/compat/app";
import { Button, Heading, HStack, Spinner, Stack, Text } from "native-base";
import React, { useReducer, useCallback } from "react";

import InputUI from "../../../components/molecules/Input";
import { createUser, signOut } from "../../../store/actions/auth";
import useAuthData from "../../../store/selectors/auth";
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
  fullName: string;
  email: string;
  channelId: string;
  companyName: string;
}

interface InputValidities {
  fullName: boolean;
  email: boolean;
  channelId: boolean;
  companyName: boolean;
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

export default function RegOne(props: any) {
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      fullName: "",
      email: "",
      channelId: "",
      companyName: "",
    },
    inputValidities: {
      fullName: true,
      email: true,
      channelId: true,
      companyName: true,
    },
    formIsValid: true,
  });

  const { status, mobile, userId } = useAuthData();
  const Auth = useAuthData();
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

  // const company = useCompanyData();

  async function submitHandler() {
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

    const user = app.auth().currentUser;
    const createDate = new Date();
    const mobile = user?.phoneNumber;

    const UserDetails: User = {
      userId,
      mobile: mobile ? mobile : null,
      fullName: formState.inputValues.fullName,
      email: formState.inputValues.email,
      channelId: formState.inputValues.channelId,
      companyName: formState.inputValues.companyName,
      pushToken: "init",
      createdAt: createDate.toISOString(),
    };

    // console.log("user", user?.phoneNumber);

    user
      ?.updateEmail(formState.inputValues.email)
      .then(() => dispatch(createUser(UserDetails)))
      .catch(() => dispatch(signOut()));

    // props.navigation.navigate("Staff");
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
      <Heading>Create Account </Heading>
      <InputUI
        initialValue=""
        initiallyValid
        id="fullName"
        label="Type in your full name"
        onInputChange={inputChangeHandler}
        errorText="Error"
        type="text"
      />
      <InputUI
        initialValue=""
        initiallyValid
        id="companyName"
        label="Type in your business name"
        onInputChange={inputChangeHandler}
        errorText="Error"
        type="text"
      />

      <InputUI
        initialValue=""
        initiallyValid
        id="email"
        label="Type in your email"
        onInputChange={inputChangeHandler}
        errorText="Error"
        type={"email"}
      />
      <InputUI
        initialValue=""
        initiallyValid
        id="channelId"
        label="Type in your channelId"
        onInputChange={inputChangeHandler}
        errorText="Error"
        type={"text"}
      />
      <Button onPress={submitHandler}>Continue</Button>
      {/* <Button onPress={() => console.log(Auth)}>Continue</Button> */}
    </Stack>
  );
}
