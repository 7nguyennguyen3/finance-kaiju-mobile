import { ImageBackground } from "react-native";
import CustomButton from "../components/ui/CustomButton";
import { colors } from "../constants/colors";
import { screenWidth } from "../constants/types";
import { useNavigation } from "@react-navigation/native";

const Introduction = () => {
  const { navigate } = useNavigation();

  return (
    <ImageBackground
      style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        padding: 20,
      }}
      source={require("../assets/intro-pic-3.png")}
    >
      <CustomButton
        buttonText="Let's Get Started!"
        onPress={() => navigate("SignUp" as never)}
        buttonColor={colors.primary800}
        buttonTextColor="white"
        style={{
          marginBottom: screenWidth * 0.15,
        }}
      />
    </ImageBackground>
  );
};

export default Introduction;
