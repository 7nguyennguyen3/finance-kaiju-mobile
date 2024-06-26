import { useNavigation } from "@react-navigation/native";
import React from "react";
import AuthForm from "../components/form/AuthForm";

const SignIn = () => {
  const { navigate } = useNavigation();

  return (
    <AuthForm
      title="Log In"
      buttonText="Submit"
      bottomText="Don't have an account? "
      bottomTextNavigation="Sign up here!"
      onBottomLinkPress={() => navigate("SignUp" as never)}
    />
  );
};

export default SignIn;
