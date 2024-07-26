import { useContext, useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { colors } from "../constants/colors";
import { screenHeight, screenWidth } from "../constants/types";
import { ExpensesContext } from "../store/expenses-context";

interface CustomBarChartProps {
  selectedMonth: number;
  selectedYear: number;
}

interface Expense {
  date: string;
  category: string;
  amount: number;
}

interface Period {
  month: number;
  year: number;
  label: string;
}

interface DataItem {
  label: string;
  value: number;
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({
  selectedMonth,
  selectedYear,
}) => {
  const [data, setData] = useState<DataItem[]>([]);

  const { expenses } = useContext(ExpensesContext);

  const getMonthName = (date: Date): string => {
    return date.toLocaleString("en-US", { month: "long" });
  };

  const calculateExpensesForMonth = (month: number, year: number): number => {
    const filteredExpenses = expenses.filter(
      (expense: Expense) =>
        new Date(expense.date).getMonth() === month &&
        new Date(expense.date).getFullYear() === year &&
        expense.category !== "INCOME" &&
        expense.category !== "PROFIT"
    );

    return filteredExpenses.reduce((total, { amount }) => total + amount, 0);
  };

  useEffect(() => {
    const periods: Period[] = [0, 1, 2, 3]
      .map((offset) => {
        const date = new Date(selectedYear, selectedMonth - offset, 1);
        return {
          month: date.getMonth(),
          year: date.getFullYear(),
          label: getMonthName(date),
        };
      })
      .reverse();

    const newData: DataItem[] = periods.map(({ month, year, label }) => {
      const value = calculateExpensesForMonth(month, year);
      return { label, value };
    });

    const isDataValid = newData.some((item) => item.value > 0);
    if (isDataValid) {
      setData(newData);
    } else {
      setData([{ label: "No Data", value: 0 }]);
    }
  }, [selectedMonth, selectedYear, expenses]);

  const maxValue = Math.max(...data.map((item) => item.value));
  const calculateRoundedMaxValue = (maxValue: number): number => {
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
          frontColor={colors.accent500}
          barMarginBottom={1}
          barBorderColor={colors.primary800}
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
