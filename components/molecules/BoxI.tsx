import { Box } from "native-base";
import React from "react";
type Props = {
  //   option: string;
  children: React.ReactNode;
};
export function BoxI({ children }: Props) {
  return (
    <Box
      //   {...props}
      alignSelf="center"
      bg="#F2F4F4"
      p="3"
      m="2"
      rounded="xl"
      _text={{
        fontSize: "xs",
        fontWeight: "medium",
        color: "#36454F",
        letterSpacing: "lg",
      }}
    >
      {children}
    </Box>
  );
}
