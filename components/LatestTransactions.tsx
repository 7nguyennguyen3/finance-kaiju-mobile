import { Alert, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { Expense } from "../constants/types";
import TransactionRecord from "./ui/TransactionRecord";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import CustomAlert from "./ui/CustomAlert";

const LatestTransactions = ({
  latestExpenses,
}: {
  latestExpenses: Expense[];
}) => {
  const [showCustomAlert, setShowCustomAlert] = useState(false);

  const validExpenses = latestExpenses.filter(
    (expense) => expense !== null && expense !== undefined
  );

  return (
    <View style={styles.list}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text style={styles.title}>Latest Expenses</Text>
        <Ionicons
          name="help-circle-sharp"
          size={26}
          color={colors.blue900}
          onPress={() => {
            setShowCustomAlert(true);
          }}
        />
      </View>
      <TransactionRecord displayExpenses={validExpenses} />
      {showCustomAlert && (
        <CustomAlert
          title="Insight"
          descriptions={[
            "Drag record left to edit or delete.",
            "Drag record right for more details.",
          ]}
          okText="OK"
          onPressOk={() => setShowCustomAlert(false)}
        />
      )}
    </View>
  );
};

export default LatestTransactions;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary800,
  },
  list: {
    flex: 1,
    marginTop: 10,
  },
});
