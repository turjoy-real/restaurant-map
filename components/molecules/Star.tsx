import { AspectRatio, Image } from "native-base";

import { View } from "../Themed";

const Stars: React.FC<{rate: number}> = ({ rate }) => {
  const rating = {
    Default_Rating: rate,
    Max_Rating: 5,
  };

  const React_Native_Rating_Bar = [];

  for (let i = 1; i <= rating.Max_Rating; i++) {
    React_Native_Rating_Bar.push(
      <AspectRatio w="4" ratio={1 / 1} mb="1" mr="1">
        <Image
          w="4"
          height="4"
          source={
            i <= rating.Default_Rating
              ? require("../../assets/icons/icons/Star-fill.png")
              : require("../../assets/icons/icons/Star-empty.png")
          }
          alt="image"
        />
      </AspectRatio>
    );
  }

  return (
    <View
      style={{
        justifyContent: "flex-start",
        flexDirection: "row",

        backgroundColor: "rgba(255, 0, 255, 0)",
      }}
    >
      {React_Native_Rating_Bar}
    </View>
  );
};

export default Stars
