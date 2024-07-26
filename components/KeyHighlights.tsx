import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { Expense, thisMonth } from "../constants/types";
import globalStyles from "../constants/globalStyles";

interface KeyHighlightsProps {
  latestMonthDeposit: string;
  latestMonthExpenses: string;
  filteredExpenses: Expense[];
}

const KeyHighlights = ({
  latestMonthDeposit,
  latestMonthExpenses,
}: KeyHighlightsProps) => {
  const infoBoxes = [
    {
      title: `Deposit`,
      value: latestMonthDeposit,
    },
    {
      title: `Expenses`,
      value: latestMonthExpenses,
    },
  ];

  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={[
          globalStyles.title,
          {
            marginVertical: 10,
            marginTop: 20,
          },
        ]}
      >
        {thisMonth} Highlights
      </Text>
      <View style={styles.infoBoxesContainer}>
        {infoBoxes.map((box, index) => (
          <View key={index} style={styles.infoBox}>
            <Text style={styles.infoBoxText}>{box.title}</Text>
            <Text
              style={[
                styles.infoBoxValue,
                box.value === latestMonthDeposit
                  ? {
                      color: colors.primary800,
                    }
                  : { color: colors.error500 },
              ]}
            >
              ${Number(box.value)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default KeyHighlights;

const styles = StyleSheet.create({
  infoBox: {
    minWidth: "47%",
    height: 80,
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    elevation: 2,
  },
  infoBoxText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  infoBoxValue: {
    fontSize: 16,
    marginTop: 5,
    textAlign: "center",
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary500,
    marginVertical: 10,
    textAlign: "center",
  },
  infoBoxesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
