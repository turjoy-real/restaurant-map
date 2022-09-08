import { Text, TextProps } from "../Themed";
import React from "react";
export function SectionHeader(props: TextProps) {
  return (
    <Text
      {...props}
      style={[
        props.style,
        { fontFamily: "sf-pro", fontSize: 20, padding: 10, fontWeight: "bold" },
      ]}
    />
  );
}
