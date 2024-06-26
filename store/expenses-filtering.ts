import { useContext } from "react";
import { ExpensesContext } from "./expenses-context";

export const useExpensesData = () => {
  const { expenses } = useContext(ExpensesContext);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const filteredExpenses = expenses.filter((expense) => {
    return (
      new Date(expense.date) >
      new Date(new Date().getFullYear(), new Date().getMonth())
    );
  });

  const displayExpenses = filteredExpenses
    .filter(
      (expense) =>
        expense.category !== "INCOME" && expense.category !== "PROFIT"
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const latestMonthExpenses = filteredExpenses
    .filter(
      (expense) =>
        expense.category !== "INCOME" && expense.category !== "PROFIT"
    )
    .reduce((acc, curr) => acc + curr.amount, 0)
    .toFixed(2);

  const latestMonthDeposit =
    filteredExpenses
      .filter(
        (expense) =>
          expense.category === "INCOME" || expense.category === "PROFIT"
      )
      .reduce((acc, curr) => acc + curr.amount, 0)
      .toFixed(2) || "0.00";

  const previousMonthExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getFullYear() === currentYear &&
        expenseDate.getMonth() === currentMonth - 1 &&
        expense.category !== "INCOME" &&
        expense.category !== "PROFIT"
      );
    })
    .reduce((acc, curr) => acc + curr.amount, 0)
    .toFixed(2);

  const twoMonthsAgoExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getFullYear() === currentYear &&
        expenseDate.getMonth() === currentMonth - 2 &&
        expense.category !== "INCOME" &&
        expense.category !== "PROFIT"
      );
    })
    .reduce((acc, curr) => acc + curr.amount, 0)
    .toFixed(2);

  return {
    displayExpenses,
    latestMonthExpenses,
    filteredExpenses,
    previousMonthExpenses,
    twoMonthsAgoExpenses,
    latestMonthDeposit,
  };
};
