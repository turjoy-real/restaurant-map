import { VStack, Input, Box } from "native-base";
import React, { useReducer, useEffect } from "react";

import { Text } from "../Themed";

// An enum with all the types of actions to use in our reducer
enum InputActionKind {
  INPUT_BLUR = "INPUT_BLUR",
  INPUT_CHANGE = "INPUT_CHANGE",
}

// An interface for our actions
interface InputAction {
  type: InputActionKind;
  value: string;
  isValid: boolean;
}

// An interface for our state
interface InputState {
  value: string;
  isValid: boolean;
  touched: boolean;
}

const inputReducer = (state: InputState, action: InputAction) => {
  switch (action.type) {
    case InputActionKind.INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case InputActionKind.INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

type Props = {
  initialValue: string;
  initiallyValid: boolean;
  onInputChange: Function;
  id: string;
  label: string;
  errorText: string;
  type: string;
};

const InputUI: React.FC<Props> = ({
  initialValue,
  initiallyValid,
  onInputChange,
  id,
  type,
  label,
  errorText,
  ...props
}) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: initialValue ? initialValue : "",
    isValid: initiallyValid,
    touched: false,
  });

  useEffect(() => {
    if (inputState.touched) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
    // console.log('test', inputState);
  }, [inputState, onInputChange, id]);

  const textChangeHandler = (text: string) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // const decNumRegex = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/;
    // const textNumSpaceRegex = /^[A-Za-z0-9 _]*$/;
    // const textNumUnderscoreRegex = /^[A-Za-z0-9_]*$/;
    // const textNumRegex = /^[A-Za-z0-9()]*$/;
    // const numRegex = /^[0-9]*$/;
    // const mobileRgEx = /^[0-9+]*$/;
    let isValid = true;
    // if (props.textNumSpace && !textNumSpaceRegex.test(text)) {
    //   isValid = false;
    // }

    if (type === "email" && !emailRegex.test(text)) {
      isValid = false;
    }

    if (type === "password" && text.length < 5) {
      isValid = false;
    }


    // if (type === "mobile" && !mobileRgEx.test(text)) {
    //   // console.log("here");

    //   isValid = false;
    // }

    // if (props.subAccountId && !textNumUnderscoreRegex.test(text)) {
    //   isValid = false;
    // }

    // if (props.textNum && !textNumRegex.test(text)) {
    //   isValid = false;
    // }

    // if (props.decNum && !decNumRegex.test(text)) {
    //   isValid = false;
    // }

    // if (props.num && !numRegex.test(text)) {
    //   isValid = false;
    // }

    // if (props.minLength != null && text.length < minLength) {
    //   isValid = false;
    // }

    // if (props.minLength != null && text.length < props.minLength) {
    //   isValid = false;
    // }

    // if (props.optional && text.length < 1) {
    //   isValid = true;
    // }

    // if (props.required && text.trim().length === 0) {
    //   isValid = false;
    // }
    if (type === "email" && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    // if (props.min != null && +text < props.min) {
    //   isValid = false;
    // }
    // if (props.max != null && +text > props.max) {
    //   isValid = false;
    // }
    // if (props.minLength != null && text.length < props.minLength) {
    //   isValid = false;
    // }

    dispatch({ type: InputActionKind.INPUT_CHANGE, value: text, isValid });
  };

  const lostFocusHandler = () => {
    dispatch({ type: InputActionKind.INPUT_BLUR, value: " ", isValid: true });
  };

  return (
    <VStack space={1} alignItems="center">
      <Text>{label}</Text>
      <Input
        {...props}
        value={inputState.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocusHandler}
        onFocus={lostFocusHandler}
      />
      {!inputState.isValid && inputState.touched && (
        <Box>
          <Text style={{color: "red"}}>{errorText}</Text>
        </Box>
      )}
    </VStack>
  );
};

export default InputUI;
