import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet } from "react-native";
import AuthForm from "../components/form/AuthForm";

const SignUp = () => {
  const { navigate } = useNavigation();

  return (
    <AuthForm
      bottomText="Already have an account? "
      buttonText="Sign Up"
      bottomTextNavigation="Sign in here!"
      isSignUp={true}
      onBottomLinkPress={() => navigate("SignIn" as never)}
      requireName={true}
      title="Let's Get Started!"
    />
  );
};

export default SignUp;

const styles = StyleSheet.create({
  inputField: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
  },
});
