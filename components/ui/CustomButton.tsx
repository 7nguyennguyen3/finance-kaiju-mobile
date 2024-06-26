import {
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../constants/colors";
import Color from "color";

interface CustomButtonProps {
  buttonText: string;
  buttonColor?: string;
  buttonTextColor?: string;
  onPress: () => void;
  style?: ViewStyle;
  isLoading?: boolean;
}

const CustomButton = ({
  buttonText,
  buttonColor = colors.primary500,
  buttonTextColor = "white",
  onPress,
  style,
  isLoading = false,
}: CustomButtonProps) => {
  const lighterColor = Color(buttonColor).lighten(0.4).hex();

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: lighterColor }}
      style={({ pressed }) => [
        styles.buttonContainer,
        {
          backgroundColor: isLoading ? colors.zinc300 : buttonColor,
          opacity: pressed ? 0.7 : 1,
          ...style,
        },
      ]}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={buttonTextColor} />
      ) : (
        <Text style={[styles.buttonText, { color: buttonTextColor }]}>
          {buttonText}
        </Text>
      )}
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 8,
    width: "100%",
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
});
