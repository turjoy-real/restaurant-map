import React from "react";
import { IconButton } from "native-base";
import { GestureResponderEvent } from "react-native";

type Props = {
  IconSpec: JSX.Element;
  onSelect: (event: GestureResponderEvent) => void;
};
export function IconButtonUI({ IconSpec, onSelect }: Props) {
  return (
    <IconButton
      icon={IconSpec}
      borderRadius="full"
      _icon={{
        color: "muted.700",
        size: "md",
      }}
      _hover={{
        bg: "coolGray.800:alpha.20",
      }}
      // _pressed={{
      //   bg: 'coolGray.800:alpha.20',
      // }}
      onPress={onSelect}
    />
  );
}
