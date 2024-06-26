import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import * as Progress from "react-native-progress";
import { colors } from "../../constants/colors";
import { screenWidth } from "../../constants/types";
import { GoalForm } from "../form/GoalForm";

interface ProgressTrackProps {
  progress?: number;
  color?: string;
  description: string;
  goal: number;
  goalProgress: number | string;
  goalType: "deposit" | "budget";
}

const ProgressTrack = ({
  progress = 0.8,
  color = colors.primary500,
  description = "Progress",
  goalProgress,
  goal,
  goalType,
}: ProgressTrackProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{description}</Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={styles.description}>{goalProgress}</Text>
          <Pressable
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Ionicons
              name="create-outline"
              size={24}
              color={colors.primary800}
              style={{ marginBottom: 5 }}
            />
          </Pressable>
        </View>
      </View>
      <Progress.Bar
        borderWidth={2}
        progress={progress}
        width={screenWidth * 0.9}
        color={color}
        height={10}
      />
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
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
          <GoalForm
            goalType={goalType}
            initialValues={
              goalType === "budget"
                ? { budgetGoal: goal }
                : { depositGoal: goal }
            }
            afterSubmitFunction={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

export default ProgressTrack;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginVertical: 10,
  },
  descriptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  description: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 5,
  },
  modalView: {
    backgroundColor: colors.zinc200,
    opacity: 0.92,
    borderRadius: 5,
    padding: 25,
    height: "auto",
    width: "90%",
    margin: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "left",
    color: colors.zinc900,
  },
});
