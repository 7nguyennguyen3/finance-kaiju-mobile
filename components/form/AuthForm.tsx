import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Formik } from "formik";
import { useContext, useState } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import globalStyles from "../../constants/globalStyles";
import {
  passwordResetSchema,
  signInSchema,
  signUpSchema,
} from "../../constants/schema";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import CustomButton from "../ui/CustomButton";
import FormTextInput from "./FormTextInput";
import CustomAlert from "../ui/CustomAlert";
import { GoalContext } from "../../store/goal-context";

type AuthFormProps = {
  title: string;
  buttonText: string;
  bottomText: string;
  bottomTextNavigation: string;
  onBottomLinkPress: () => void;
  requireName?: boolean;
  isSignUp?: boolean;
};

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  buttonText,
  bottomText,
  onBottomLinkPress,
  bottomTextNavigation,
  requireName = false,
  isSignUp = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [descriptionMessages, setDescriptionMessages] = useState<string[]>([]);
  const [passwordResetTitle, setPasswordResetTitle] = useState("");
  const { setUserEmail, setIsEmailVerified } = useContext(GoalContext);
  const { navigate } = useNavigation();

  const handleAuth = async (values: {
    email: string;
    password: string;
    username?: string;
  }) => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          FIREBASE_AUTH,
          values.email,
          values.password
        );
        try {
          await updateProfile(userCredential.user, {
            displayName: values.username,
          });
        } catch (error) {
          console.error("Error during profile update");
        }

        if (!userCredential.user.emailVerified) {
          await sendEmailVerification(userCredential.user);
          navigate("EmailVerify" as never);
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(
          FIREBASE_AUTH,
          values.email,
          values.password
        );
        if (!userCredential.user.emailVerified) {
          await sendEmailVerification(userCredential.user);
          navigate("EmailVerify" as never);
        }
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-credential":
            errorMessage =
              "The provided credential is invalid. \n\nPlease check and try again.";
            break;
          case "auth/email-already-in-use":
            errorMessage =
              "This email is already in use. \n\nPlease use a different email or sign in.";
            break;
        }
      }
      Alert.alert("Error", errorMessage, [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, email);
      setDescriptionMessages([
        "Password reset email sent.",
        "Please check your email.",
      ]);
      setPasswordResetTitle("Success");
      setModalVisible(false);
      setShowCustomAlert(true);
    } catch (error) {
      setPasswordResetTitle("Error");
      setDescriptionMessages([
        "Failed to send password reset email.",
        "Please try again.",
      ]);
      setShowCustomAlert(true);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
          username: "",
        }}
        validationSchema={requireName ? signUpSchema : signInSchema}
        onSubmit={handleAuth}
      >
        {({ handleSubmit }) => (
          <View style={styles.container}>
            <Text style={globalStyles.title}>{title}</Text>
            {requireName && (
              <FormTextInput name="username" placeholder="Name" />
            )}
            <FormTextInput name="email" placeholder="Email" />
            <FormTextInput
              name="password"
              placeholder="Password"
              secureTextEntry
            />
            <View
              style={{
                width: "100%",
                marginTop: 10,
              }}
            >
              <CustomButton
                buttonText={buttonText}
                isLoading={isLoading}
                onPress={() => {
                  handleSubmit();
                }}
              />
            </View>
            {isSignUp && (
              <CustomButton
                buttonText="Explore the App as Guest"
                onPress={() => {
                  setUserEmail("financekaijuce@test.com");
                  setIsEmailVerified(true);
                }}
                buttonColor={colors.accent800}
                style={{ marginTop: 20 }}
              />
            )}
            <View
              style={{
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Text style={{ fontSize: 16 }}>
                {bottomText}
                <Text onPress={onBottomLinkPress} style={styles.blueLinkUnder}>
                  {bottomTextNavigation}
                </Text>
              </Text>
            </View>
            {!isSignUp && (
              <View style={{ marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: 16,
                  }}
                >
                  Forgot Your Password?{" "}
                  <Text
                    style={styles.blueLinkUnder}
                    onPress={() => setModalVisible(true)}
                  >
                    Click here!
                  </Text>
                </Text>
              </View>
            )}
          </View>
        )}
      </Formik>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <Formik
            initialValues={{ passwordResetEmail: "" }}
            validationSchema={passwordResetSchema}
            onSubmit={(values) =>
              handlePasswordReset(values.passwordResetEmail)
            }
          >
            {({ handleSubmit }) => (
              <View style={styles.modalView}>
                <Ionicons
                  name="close"
                  size={30}
                  color={colors.error500}
                  onPress={() => setModalVisible(false)}
                  style={{ alignSelf: "flex-end", marginBottom: 10 }}
                />
                <FormTextInput
                  name="passwordResetEmail"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
                <CustomButton
                  style={{ marginTop: 10 }}
                  buttonText="Send Password Reset Link"
                  onPress={handleSubmit}
                />
              </View>
            )}
          </Formik>
        </View>
      </Modal>
      {showCustomAlert && (
        <CustomAlert
          title={passwordResetTitle}
          descriptions={descriptionMessages}
          okText="OK"
          onPressOk={() => setShowCustomAlert(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  blueLinkUnder: {
    color: colors.blue500,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTextInput: {
    marginBottom: 15,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderBottomWidth: 1,
    width: "100%",
    color: colors.zinc800,
  },
});

export default AuthForm;
