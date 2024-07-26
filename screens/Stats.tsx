import { Ionicons } from "@expo/vector-icons";
import { useContext, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import MonthSwitch from "../components/MonthSwitch";
import { colors } from "../constants/colors";
import globalStyles from "../constants/globalStyles";
import { categories } from "../constants/types";
import { ExpensesContext } from "../store/expenses-context";
import globalStore from "../store/store";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import BouncingDots from "../components/ui/BouncingDots";

const Stats = () => {
  const { expenses } = useContext(ExpensesContext);
  const { addMonthData, isGlobalLoading } = globalStore();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const filteredExpenses = useMemo(
    () =>
      expenses.filter(
        (expense) =>
          new Date(expense.date).getMonth() === selectedMonth &&
          new Date(expense.date).getFullYear() === selectedYear
      ),
    [expenses, selectedMonth, selectedYear]
  );

  const threeHighestExpenses = filteredExpenses
    .filter(
      (expense) =>
        expense.category !== "INCOME" && expense.category !== "PROFIT"
    )
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  const goToPreviousMonth = () => {
    setSelectedMonth((prevMonth) => {
      if (prevMonth === 0) {
        setSelectedYear((prevYear) => prevYear - 1);
        addMonthData(`12/${selectedYear - 1}`);
        return 11; // December of the previous year
      } else {
        addMonthData(`${prevMonth}/${selectedYear}`);
        return prevMonth - 1;
      }
    });
  };

  const goToNextMonth = () => {
    setSelectedMonth((prevMonth) => {
      if (prevMonth === 11) {
        setSelectedYear((prevYear) => prevYear + 1);
        addMonthData(`1/${selectedYear + 1}`);
        return 0;
      } else {
        addMonthData(`${prevMonth + 2}/${selectedYear}`);
        return prevMonth + 1;
      }
    });
  };

  const expenseTotal = filteredExpenses.reduce((total, expense) => {
    if (expense.category !== "INCOME" && expense.category !== "PROFIT") {
      total += expense.amount;
    }
    return total;
  }, 0);

  const incomeTotal = filteredExpenses.reduce((total, expense) => {
    if (expense.category === "INCOME" || expense.category === "PROFIT") {
      total += expense.amount;
    }
    return total;
  }, 0);

  const expenseTotalByCat = filteredExpenses
    .filter(
      (expense) =>
        expense.category !== "INCOME" && expense.category !== "PROFIT"
    )
    .reduce<{ [key: string]: number }>((totals, expense) => {
      if (!totals[expense.category]) {
        totals[expense.category] = 0;
      }
      totals[expense.category] += expense.amount;
      return totals;
    }, {});

  const depositTotal = filteredExpenses
    .filter(
      (expense) =>
        expense.category === "INCOME" || expense.category === "PROFIT"
    )
    .reduce<{ [key: string]: number }>((totals, expense) => {
      if (!totals[expense.category]) {
        totals[expense.category] = 0;
      }
      totals[expense.category] += expense.amount;
      return totals;
    }, {});

  // Create a single legend
  const legend = Object.entries(categories)
    .map(([category, { color, icon }]) => {
      // Calculate total and percentage
      const total =
        category === "INCOME" || category === "PROFIT"
          ? depositTotal[category] || 0
          : expenseTotalByCat[category] || 0;
      const totalExpenses =
        category === "INCOME" || category === "PROFIT"
          ? Object.values(depositTotal).reduce((a, b) => a + b, 0)
          : Object.values(expenseTotalByCat).reduce((a, b) => a + b, 0);
      const percentage = (total / totalExpenses) * 100;

      // Skip categories with 0%
      if (percentage === 0) {
        return null;
      }

      return {
        category,
        percentage,
        element: (
          <View
            key={category}
            style={{
              padding: 5,
              elevation: 2,
              borderColor: colors.gray500,
              borderWidth: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Ionicons name={icon} size={24} color={color} />
              <Text
                style={{
                  fontWeight: "bold",
                  color: colors.blue500,
                }}
              >
                {!isNaN(percentage) && `${percentage.toFixed(2)}%`}
              </Text>
            </View>

            <Text
              style={{
                fontWeight: "bold",
                textAlign: "right",
              }}
            >
              ${Number(total.toFixed(2))}
            </Text>
          </View>
        ),
      };
    })
    .filter(Boolean) // Remove null elements before sorting
    .sort((a, b) => (b ? b.percentage : 0) - (a ? a.percentage : 0)); // Sort by descending order of percentage

  const expenseLegend = legend.filter(
    (item) =>
      item !== null && item.category !== "INCOME" && item.category !== "PROFIT"
  );

  const incomeLegend = legend.filter(
    (item) =>
      item !== null &&
      (item.category === "INCOME" || item.category === "PROFIT")
  );

  return (
    <ScrollView>
      <View style={[globalStyles.container]}>
        <MonthSwitch
          goToNextMonth={goToNextMonth}
          goToPreviousMonth={goToPreviousMonth}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          setSelectedMonth={setSelectedMonth}
          setSelectedYear={setSelectedYear}
        />
        {isGlobalLoading ? (
          <>
            <View
              style={{
                borderColor: colors.gray500,
                borderWidth: 1.8,
                elevation: 2,
                padding: 10,
                width: "97%",
                margin: "auto",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: colors.accent800,
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                Highest Transactions
              </Text>
              <LoadingSkeleton itemCount={3} height={20} />
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.titleContainerText}>Expense</Text>
              <BouncingDots />
            </View>

            <LoadingSkeleton
              itemCount={3}
              height={45}
              style={{ marginVertical: 10 }}
            />

            <View style={[styles.titleContainer, { marginTop: 20 }]}>
              <Text style={styles.titleContainerText}>Deposit</Text>
              <BouncingDots />
            </View>

            <LoadingSkeleton
              itemCount={1}
              height={45}
              style={{ marginTop: 10 }}
            />
          </>
        ) : (
          <>
            <View
              style={{
                borderColor: colors.gray500,
                borderWidth: 1.8,
                elevation: 2,
                padding: 10,
                width: "97%",
                margin: "auto",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: colors.accent800,
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                Highest Transactions
              </Text>
              {threeHighestExpenses.map((expense, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.gray500,
                    marginBottom: 5,
                  }}
                >
                  <Text>
                    {!expense.description
                      ? "No Description"
                      : expense.description.length > 30
                      ? `${expense.description.substring(0, 25)}...`
                      : expense.description}
                  </Text>
                  <Text
                    style={{
                      color: colors.error500,
                      fontWeight: "bold",
                    }}
                  >
                    ${expense.amount}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.titleContainerText}>Expense</Text>
              <Text
                style={{
                  color: colors.error500,
                  fontWeight: "bold",
                }}
              >
                ${Number(expenseTotal.toFixed(2))}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {expenseLegend.map((item, index) => (
                <View
                  key={index}
                  style={{
                    width: "47%",
                    margin: 5,
                  }}
                >
                  {item?.element}
                </View>
              ))}
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.titleContainerText}>Deposit</Text>
              <Text
                style={{
                  color: colors.primary500,
                  fontWeight: "bold",
                }}
              >
                ${Number(incomeTotal.toFixed(2))}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                {incomeLegend.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      width: "47%",
                      margin: 5,
                    }}
                  >
                    {item?.element}
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default Stats;

const styles = StyleSheet.create({
  titleContainer: {
    borderWidth: 2,
    borderColor: colors.gray500,
    marginTop: 30,
    padding: 5,
    margin: 5,
    width: "97%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
  },
  titleContainerText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
