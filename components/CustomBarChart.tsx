import { useContext, useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { colors } from "../constants/colors";
import { screenHeight, screenWidth } from "../constants/types";
import { ExpensesContext } from "../store/expenses-context";

const CustomBarChart = ({ selectedMonth, selectedYear }) => {
  const [data, setData] = useState([]);

  const { expenses } = useContext(ExpensesContext);

  const getMonthName = (date) => {
    return date.toLocaleString("en-US", { month: "long" });
  };

  const calculateExpensesForMonth = (month, year) => {
    const filteredExpenses = expenses.filter(
      (expense) =>
        new Date(expense.date).getMonth() === month &&
        new Date(expense.date).getFullYear() === year &&
        expense.category !== "INCOME" &&
        expense.category !== "PROFIT"
    );
    return filteredExpenses.reduce((total, { amount }) => total + amount, 0);
  };

  useEffect(() => {
    const periods = [0, 1, 2, 3]
      .map((offset) => {
        // Adjust the month calculation here
        const date = new Date(selectedYear, selectedMonth - offset, 1);
        return {
          month: date.getMonth(),
          year: date.getFullYear(),
          label: getMonthName(date),
        };
      })
      .reverse(); // Reverse the array to get the months in the correct order

    const newData = periods.map(({ month, year, label }) => ({
      label,
      value: calculateExpensesForMonth(month, year),
    }));

    const isDataValid = newData.some((item) => item.value > 0);
    if (isDataValid) {
      setData(newData);
    } else {
      setData([{ label: "No Data", value: 0 }]);
    }
  }, [selectedMonth, selectedYear, expenses]);

  const maxValue = Math.max(...data.map((item) => item.value));
  const calculateRoundedMaxValue = (maxValue) => {
    if (maxValue < 200) {
      return Math.ceil(maxValue * 1.1);
    } else {
      const tenPercentHigher = Math.ceil(maxValue * 1.1);
      return Math.ceil(tenPercentHigher / 100) * 100;
    }
  };

  const roundedMaxValue = calculateRoundedMaxValue(maxValue);

  const isDataValid = data.some((item) => item.value > 0);

  return (
    <View
      style={{
        elevation: 2,
        padding: 10,
        borderWidth: 1,
      }}
    >
      <Text
        style={{
          color: colors.primary800,
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        Spending Overview
      </Text>
      {isDataValid ? (
        <BarChart
          data={data}
          barWidth={screenWidth / 8}
          height={screenHeight * 0.14}
          maxValue={roundedMaxValue}
          noOfSections={4}
          dashWidth={10}
          verticalLinesColor={colors.primary500}
          color={colors.primary500}
          frontColor={colors.primary500}
          barMarginBottom={0.5}
          barBorderColor={colors.primary800}
          showGradient={true}
          gradientColor={colors.accent200}
          onPress={(value: any) => {
            Alert.alert(
              `Total Spent in ${value.label}`,
              `$${Number(value.value.toFixed(2))}`,
              [{ text: "OK" }],
              { cancelable: true }
            );
          }}
        />
      ) : (
        <Text style={{ textAlign: "center", color: colors.primary500 }}>
          No data available for the selected period.
        </Text>
      )}
    </View>
  );
};

export default CustomBarChart;
