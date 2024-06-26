import { StyleSheet, Text, View } from "react-native";
import { Expense } from "../constants/types";

const ExpenseEdit = ({ route }: { route: any }) => {
  const expense: Expense = route.params.expense;

  return (
    <View style={styles.container}>
      <Text>{expense.amount}</Text>
      <Text>{expense.category}</Text>
      <Text>{expense.date}</Text>
    </View>
  );
};

export default ExpenseEdit;

const styles = StyleSheet.create({
  container: {},
});
