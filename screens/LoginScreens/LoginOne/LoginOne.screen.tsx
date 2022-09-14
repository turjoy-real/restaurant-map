import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
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
import React, { useReducer, useCallback, useRef, useEffect } from "react";
import app from "firebase/compat/app";

import InputUI from "../../../components/molecules/Input";
import firebaseConfig from "../../../components/config/firebaseConfig";
import {
  fetchUser,
  mobileSignIn,
  requestPhoneOtpDevice,
} from "../../../store/actions/auth";
import useAuthData from "../../../store/selectors/auth";
import { useAppDispatch, useAppSelector } from "../../../store/selectors/hooks";

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
  mobile: string;
  otp: string;
}

interface InputValidities {
  mobile: boolean;
  otp: boolean;
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
  const { userId, token } = useAuthData();
  const auth = useAppSelector((state) => state.Auth);
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      mobile: "",
      otp: "",
    },
    inputValidities: {
      mobile: false,
      otp: false,
    },
    formIsValid: false,
  });

  const { verificationId, status } = useAuthData();
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

  const recaptchaVerifier = useRef(null);
  const dispatch = useAppDispatch();
  async function requestOTP() {
    try {
      // setIsLoading(false);
      interface OTPReq {
        phoneNumber: string;
        appVerifier: any;
      }
      const InputsForOTP: OTPReq = {
        phoneNumber: formState.inputValues.mobile,
        appVerifier: recaptchaVerifier.current,
      };
      await dispatch(requestPhoneOtpDevice(InputsForOTP));
    } catch (err: any) {
      console.log(err.message);
      // setIsLoading(false);
    }
  }

  function submitOTP() {
    interface OTPSubmit {
      verificationId: any;
      code: any;
    }
    const OTPConfirm: OTPSubmit = {
      verificationId,
      code: formState.inputValues.otp,
    };
    app
      .auth()
      .setPersistence(app.auth.Auth.Persistence.LOCAL)
      .then(() => {
        dispatch(mobileSignIn(OTPConfirm));
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("error", errorCode, errorMessage);
      });
  }

  return (
    <Center>
      <Box m="10">
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
          attemptInvisibleVerification
        />
        {status === "loading" ? (
          <HStack space={2} alignItems="center">
            <Spinner accessibilityLabel="Loading posts" />
            <Heading color="primary.500" fontSize="md">
              Loading
            </Heading>
          </HStack>
        ) : (
          <Stack alignItems="center" space={3}>
            {verificationId ? (
              <>
                <InputUI
                  initialValue=""
                  initiallyValid
                  id="otp"
                  label="type_in_otp"
                  onInputChange={inputChangeHandler}
                  errorText="Error"
                  type={"mobile"}
                />
                <Button onPress={submitOTP}>Submit OTP</Button>
                <Button onPress={requestOTP}>Resend OTP</Button>
              </>
            ) : (
              <Box m="2">
                <InputUI
                  initialValue=""
                  initiallyValid
                  id="mobile"
                  label="Type in your mobile number"
                  onInputChange={inputChangeHandler}
                  errorText="Error"
                  type={"mobile"}
                />
                <Button onPress={requestOTP} m="10">
                  Request OTP
                </Button>
              </Box>
            )}
          </Stack>
        )}
      </Box>
    </Center>
  );
}
