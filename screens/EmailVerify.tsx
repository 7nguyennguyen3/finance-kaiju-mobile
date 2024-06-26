import { sendEmailVerification } from "firebase/auth";
import { useContext, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import CustomButton from "../components/ui/CustomButton";
import { colors } from "../constants/colors";
import globalStyles from "../constants/globalStyles";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { GoalContext } from "../store/goal-context";
import CustomAlert from "../components/ui/CustomAlert";

const EmailVerify = () => {
  const { setIsEmailVerified } = useContext(GoalContext);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false);

  const user = FIREBASE_AUTH.currentUser;

  const checkEmailVerification = async () => {
    setIsLoading(true);
    await FIREBASE_AUTH.currentUser?.reload();
    const isVerified = FIREBASE_AUTH.currentUser?.emailVerified;

    if (isVerified) {
      setIsEmailVerified(true);
    } else {
      setShowCustomAlert(true);
    }
    setIsLoading(false);
  };

  const handleResendEmail = async () => {
    setIsButtonDisabled(true);
    await sendEmailVerification(user);
    setTimeout(() => setIsButtonDisabled(false), 30000);
  };

  return (
    <View
      style={[
        globalStyles.container,
        {
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      {showCustomAlert && (
        <CustomAlert
          title="Email Not Verified"
          descriptions={[
            "An error occurred while verifying your email.",
            "Please try again later.",
          ]}
          okText="OK"
          onPressOk={() => setShowCustomAlert(false)}
        />
      )}
      <Text style={[globalStyles.title, { borderWidth: 0 }]}>
        Hello {user.displayName || "User"}!
      </Text>
      <Text style={[styles.text, { marginBottom: 0 }]}>
        An email has been sent for verification.
      </Text>
      <Text style={styles.text}>Please verify your email to continue.</Text>
      <CustomButton
        buttonText="I verified it!"
        onPress={checkEmailVerification}
        style={{
          marginVertical: 10,
        }}
        isLoading={isLoading}
      />
      <CustomButton
        buttonText="Resend Verification Email"
        onPress={handleResendEmail}
        isLoading={isButtonDisabled}
        style={{
          marginTop: 15,
        }}
        buttonColor={colors.zinc500}
      />
      <Text style={[styles.text, { color: colors.accent950, marginTop: 20 }]}>
        {isButtonDisabled &&
          "Verification email resent. Please wait 30 seconds before trying again."}
      </Text>
    </View>
  );
};

export default EmailVerify;

const styles = StyleSheet.create({
  text: {
    color: colors.zinc800,
    fontSize: 16,
    marginVertical: 20,
    width: "100%",
    textAlign: "center",
  },
});
