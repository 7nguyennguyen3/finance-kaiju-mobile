import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";

interface CustomAlertProps {
  title: string;
  descriptions: string[]; // Array of descriptions
  okText: string;
  cancelText?: string; // Added cancelText prop
  onPressOk?: () => void; // Renamed to onPressOk for clarity
  onPressCancel?: () => void; // Added onPressCancel prop
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  title,
  descriptions,
  okText,
  cancelText,
  onPressOk,
  onPressCancel,
}) => {
  return (
    <Modal transparent={true} visible={true} animationType="fade">
      <View style={styles.centeredView}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{title}</Text>
          {descriptions.map((description, index) => (
            <Text key={index} style={styles.description}>
              {description}
            </Text>
          ))}
          <View style={styles.buttonContainer}>
            {cancelText && (
              <Pressable style={styles.cancelButton} onPress={onPressCancel}>
                <Text style={[styles.buttonText, { color: colors.zinc800 }]}>
                  {cancelText}
                </Text>
              </Pressable>
            )}
            <Pressable style={styles.okButton} onPress={onPressOk}>
              <Text style={styles.buttonText}>{okText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  alertBox: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    lineHeight: 24,
    color: colors.blue500,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "left",
    lineHeight: 22,
    color: colors.zinc800,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  okButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginLeft: 10, // Added margin to separate from cancel button
  },
  cancelButton: {
    backgroundColor: "#CCCCCC", // Different color for cancel button
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomAlert;
