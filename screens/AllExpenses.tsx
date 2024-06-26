import { Ionicons } from "@expo/vector-icons";
import { useContext, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import MonthSwitch from "../components/MonthSwitch";
import PaginationComponent from "../components/ui/Pagination";
import TransactionRecord from "../components/ui/TransactionRecord";
import { colors } from "../constants/colors";
import globalStyles from "../constants/globalStyles";
import { categories } from "../constants/types";
import { ExpensesContext } from "../store/expenses-context";

const Test = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedCategories, setSelectedCategories] = useState(
    Object.keys(categories).filter(
      (category) => category !== "INCOME" && category !== "PROFIT"
    )
  );
  const [currentPage, setCurrentPage] = useState(1);
  const { expenses } = useContext(ExpensesContext);

  const goToPreviousMonth = () => {
    setSelectedMonth((prevMonth) => {
      if (prevMonth === 0) {
        setSelectedYear((prevYear) => prevYear - 1);
        return 11; // December of the previous year
      } else {
        return prevMonth - 1;
      }
    });
  };

  const goToNextMonth = () => {
    setSelectedMonth((prevMonth) => {
      if (prevMonth === 11) {
        setSelectedYear((prevYear) => prevYear + 1);
        return 0;
      } else {
        return prevMonth + 1;
      }
    });
  };

  const incomeCategories = ["INCOME", "PROFIT"];

  const handleCategorySelect = (categoryKey: string) => {
    setSelectedCategories((prevCategories) => {
      const isIncomeCategory = incomeCategories.includes(categoryKey);

      // Prevent deselection if it's the only category selected
      if (prevCategories.length === 1 && prevCategories.includes(categoryKey)) {
        Alert.alert("Error", "At least one category must be selected.", [
          { text: "OK" },
        ]);
        return prevCategories;
      }

      if (isIncomeCategory) {
        // If selecting an income category and any expense category is selected, clear them
        const expenseCategoriesSelected = prevCategories.some(
          (category) => !incomeCategories.includes(category)
        );
        if (expenseCategoriesSelected) {
          return [categoryKey];
        }

        // Toggle income category
        if (prevCategories.includes(categoryKey)) {
          return prevCategories.filter((category) => category !== categoryKey);
        } else {
          return [...prevCategories, categoryKey];
        }
      } else {
        // If selecting an expense category and any income category is selected, clear them
        const incomeCategoriesSelected = prevCategories.some((category) =>
          incomeCategories.includes(category)
        );
        if (incomeCategoriesSelected) {
          return [categoryKey];
        }

        // Toggle expense category
        if (prevCategories.includes(categoryKey)) {
          return prevCategories.filter((category) => category !== categoryKey);
        } else {
          return [...prevCategories, categoryKey];
        }
      }
    });
  };

  const categoryHasExpenses = (categoryKey: string) => {
    return filteredExpenses.some((expense) => expense.category === categoryKey);
  };

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        const date = new Date(expense.date);
        const isDateMatch =
          date.getMonth() === selectedMonth &&
          date.getFullYear() === selectedYear;
        const isCategoryMatch = selectedCategories.includes(expense.category);
        return isDateMatch && isCategoryMatch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, selectedMonth, selectedYear, selectedCategories]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((acc, current) => acc + current.amount, 0);
  }, [filteredExpenses]);

  const itemsPerPage = 5;
  const totalItems = filteredExpenses.length;
  const maxPage = Math.ceil(totalItems / itemsPerPage);

  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredExpenses.slice(startIndex, endIndex);
  }, [currentPage, filteredExpenses]);

  return (
    <View style={globalStyles.container}>
      <MonthSwitch
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        setSelectedMonth={setSelectedMonth}
        setSelectedYear={setSelectedYear}
        goToPreviousMonth={goToPreviousMonth}
        goToNextMonth={goToNextMonth}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Pressable
          style={({ pressed }) => [
            styles.allPressable,
            pressed ? styles.pressed : {},
          ]}
          onPress={() =>
            setSelectedCategories(
              Object.keys(categories).filter(
                (category) => category !== "INCOME" && category !== "PROFIT"
              )
            )
          }
        >
          <Ionicons name="wallet-outline" size={30} color={colors.error500} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.allPressable,
            pressed ? styles.pressed : {},
          ]}
          onPress={() => setSelectedCategories(["INCOME", "PROFIT"])}
        >
          <Ionicons name="cash-outline" size={30} color={colors.primary500} />
        </Pressable>
      </View>
      <View style={styles.container}>
        {Object.entries(categories).map(([key, { icon, color }]) => (
          <Pressable
            key={key}
            onPress={() => handleCategorySelect(key)}
            style={({ pressed }) => [
              styles.pressable,
              selectedCategories.includes(key) &&
                (categoryHasExpenses(key)
                  ? styles.selected
                  : styles.noExpenses),
              pressed ? styles.pressed : {},
            ]}
          >
            <Ionicons name={icon} size={24} color={color} />
          </Pressable>
        ))}
      </View>
      <Text style={styles.totalAmountText}>
        Total Amount:{" "}
        <Text
          style={{
            color: selectedCategories.some((category) =>
              incomeCategories.includes(category)
            )
              ? colors.primary800
              : colors.error500,
          }}
        >
          ${Number(totalAmount.toFixed(2))}
        </Text>
      </Text>

      <PaginationComponent
        page={currentPage}
        maxPage={maxPage}
        setPage={setCurrentPage}
      />
      <TransactionRecord displayExpenses={paginatedExpenses} />
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  pressable: {
    margin: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: colors.gray900,
  },
  allPressable: {
    margin: 10,
    marginHorizontal: 20,
    padding: 5,
    borderWidth: 2,
    borderColor: colors.zinc500,
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  selected: {
    backgroundColor: colors.primary500,
  },
  noExpenses: {
    backgroundColor: colors.gray500,
  },
  pressed: {
    opacity: 0.5,
    backgroundColor: colors.zinc200,
  },
  totalAmountText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.zinc900,
  },
});
