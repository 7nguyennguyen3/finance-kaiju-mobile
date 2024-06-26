import { StyleSheet } from "react-native";
import { colors } from "./colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginVertical: 20,
    marginTop: 30,
  },
  expenseContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderColor: colors.primary800,
    borderWidth: 2,
    marginVertical: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: colors.primary500,
    textAlign: "center",
    textShadowColor: colors.zinc500,
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },

  input: {
    height: 40,
    borderColor: colors.primary500,
    borderWidth: 2,
    padding: 10,
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginVertical: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.zinc900,
  },
});
