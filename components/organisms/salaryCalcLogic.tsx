import { AntDesign } from "@expo/vector-icons";
import { Box, HStack, Heading, Center, Pressable, Text } from "native-base";
import React, { useState, Dispatch, SetStateAction } from "react";

export interface SalaryCalcLogicProp {
  heading: string;
  example: string;
  logic: string;
  id: number;
}

export const options: SalaryCalcLogicProp[] = [
  {
    id: 1,
    heading: "Calender month",
    example: "Ex:-March-31 days,April-30 days etc",
    logic: "(Per day salary = Salary/No. of days in month)",
  },
  {
    id: 2,
    heading: "Every month 30 days",
    example: "Ex:-March-30 days,April-30 days etc",
    logic: "(Per day salary = Salary/30)",
  },
  {
    id: 3,
    heading: "Exclude Weekly Offs",
    example: "Ex:-Month with 31 days and weekly offs will have 27 payable days",
    logic: "(Per day salary = Salary/Payable days)",
  },
];

const SalaryCalcLogic = ({
  setState,
}: {
  setState: Dispatch<SetStateAction<SalaryCalcLogicProp>>;
}) => {
  const [selected, setSelected] = useState(0);
  return (
    <Box>
      {options.map((data: SalaryCalcLogicProp) => {
        return (
          <Pressable
            key={data.id}
            onPress={(nextValue: any) => {
              setSelected(data.id);
              setState(data);
            }}
          >
            {({ isHovered, isPressed }) => {
              const status = selected === data.id;
              return (
                <HStack
                  borderWidth="1"
                  // borderColor="#e7eff5"
                  borderRadius={"sm"}
                  justifyContent="space-between"
                  mt="2"
                  key={data.heading}
                  borderColor={status || isHovered ? "#7098d5" : "#f1f0f1"}
                >
                  <Box p="5" w="md">
                    <Heading size="sm">{data.heading}</Heading>

                    <Text>{data.example}</Text>
                    <Text>{data.logic}</Text>
                  </Box>
                  <Box p="5">
                    <Center flex={1} px="3">
                      {/* <CheckIcon
                              size="5"
                              // color="#e7eff5"
                              color={status ? "#7098d5" : "#e7eff5"}
                            />  */}
                      {status || isHovered ? (
                        <AntDesign
                          name="checkcircle"
                          size={20}
                          color="#7098d5"
                        />
                      ) : null}
                    </Center>
                  </Box>
                </HStack>
              );
            }}
          </Pressable>
        );
      })}
    </Box>
  );
};

export default SalaryCalcLogic;
