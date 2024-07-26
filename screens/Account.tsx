import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TextInput,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signOut /*, updateProfile*/ } from "firebase/auth";
import CustomAlert from "../components/ui/CustomAlert";
import CustomButton from "../components/ui/CustomButton";
import { colors } from "../constants/colors";
import globalStyles from "../constants/globalStyles";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { GoalContext } from "../store/goal-context";
import { ExpensesContext } from "../store/expenses-context";
import globalStore from "../store/store";
// import Filter from "bad-words";

const Account = () => {
  const user = FIREBASE_AUTH.currentUser;
  const [showSignOutAlert, setShowSignOutAlert] = useState(false);
  const { setUserEmail, setIsEmailVerified } = useContext(GoalContext);
  const { setExpense } = useContext(ExpensesContext);
  const { setFetchedMonthData } = globalStore();
  // const [modalVisible, setModalVisible] = useState(false);
  // const [newDisplayName, setNewDisplayName] = useState(user?.displayName || "");
  // const [isLoading, setIsLoading] = useState(false);

  // const filter = new Filter();

  const capitalizeFirstLetter = (string: string) => {
    if (!string) return "";
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const toggleSignOutAlert = () => {
    setShowSignOutAlert(!showSignOutAlert);
  };

  const handleSignOut = () => {
    signOut(FIREBASE_AUTH);
    setUserEmail("");
    setIsEmailVerified(false);
    setExpense([]);
    setFetchedMonthData([]);
  };

  /* const updateDisplayName = async () => {
    if (FIREBASE_AUTH.currentUser) {
      if (filter.isProfane(newDisplayName)) {
        alert(
          "Display name contains prohibited words. Please choose a different name."
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      await updateProfile(FIREBASE_AUTH.currentUser, {
        displayName: newDisplayName,
      });
      setIsLoading(false);
      setModalVisible(false);
    }
  }; */

  return (
    <View style={globalStyles.container}>
      <View style={styles.container}>
        <Text style={globalStyles.title}>Your Account</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Text
            style={[
              globalStyles.title,
              { color: colors.blue500, fontSize: 19 },
            ]}
          >
            {capitalizeFirstLetter(user?.displayName)}
          </Text>
          {/* <Ionicons
            name="create-outline"
            size={24}
            color={colors.blue500}
            style={{ marginLeft: 10 }}
            onPress={() => setModalVisible(true)}
          /> */}
        </View>
        <Ionicons
          name="person-circle"
          size={100}
          color={colors.blue500}
          style={{ alignSelf: "center", marginTop: 10 }}
        />
        <Text
          style={[
            globalStyles.title,
            { color: colors.zinc900, fontSize: 17, marginVertical: 20 },
          ]}
        >
          {user?.email}
        </Text>
        <CustomButton
          buttonText="Sign Out"
          onPress={toggleSignOutAlert}
          buttonColor={colors.error500}
        />
        {showSignOutAlert && (
          <CustomAlert
            title="Sign Out"
            descriptions={["Are you sure you want to sign out?"]}
            okText="Yes"
            onPressOk={handleSignOut}
            cancelText="Cancel"
            onPressCancel={toggleSignOutAlert}
          />
        )}
        {/* <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalView}>
            <Pressable
              style={{
                alignSelf: "flex-end",
                marginBottom: 10,
              }}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={30} color={colors.error500} />
            </Pressable>
            <TextInput
              style={styles.input}
              onChangeText={setNewDisplayName}
              value={newDisplayName}
              placeholder="Enter new display name"
            />
            <CustomButton
              buttonText="Update Name"
              onPress={updateDisplayName}
              style={{ marginVertical: 10 }}
              isLoading={isLoading}
            />
          </View>
        </Modal> */}
      </View>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  modalView: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 2,
    padding: 10,
    width: "100%",
    marginVertical: 20,
    borderColor: colors.primary500,
    color: colors.zinc800,
    fontWeight: "500",
  },
});
