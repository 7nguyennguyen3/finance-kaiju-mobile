import { createContext, PropsWithChildren, useEffect, useReducer } from "react";
import { Expense, monthNames } from "../constants/types";
import { dummyExpensesData } from "../constants/dummyData";

type State = {
  expenses: Expense[];
  isUsingTestData?: boolean;
};

type Action =
  | { type: "ADD_EXPENSE"; payload: Expense }
  | { type: "DELETE_EXPENSE"; payload: number | string }
  | { type: "UPDATE_EXPENSE"; payload: Expense }
  | { type: "SET_EXPENSE"; payload: Expense[] }
  | { type: "SET_TEST_DATA_USAGE"; payload: boolean };

export interface ExpensesContextProps {
  expenses: Expense[];
  isUsingTestData: boolean;
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: number | string) => void;
  updateExpense: (expense: Expense) => void;
  setExpense: (expense: Expense[]) => void;
  setTestDataUsage: (isUsingTestData: boolean) => void;
}

export const ExpensesContext = createContext<ExpensesContextProps>({
  expenses: [],
  isUsingTestData: false,
  addExpense: () => {},
  deleteExpense: () => {},
  updateExpense: () => {},
  setExpense: () => {},
  setTestDataUsage: () => {},
});

function expensesReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_EXPENSE":
      return { expenses: [action.payload, ...state.expenses] };
    case "DELETE_EXPENSE":
      return {
        expenses: state.expenses.filter(
          (expense) => expense.id !== action.payload
        ),
      };
    case "UPDATE_EXPENSE":
      return {
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case "SET_EXPENSE":
      return { expenses: action.payload }; // update this line
    case "SET_TEST_DATA_USAGE":
      return { ...state, isUsingTestData: action.payload };
    default:
      return state;
  }
}

export default function ExpensesContextProvider({
  children,
}: PropsWithChildren) {
  const [expensesState, dispatch] = useReducer(expensesReducer, {
    expenses: [...dummyExpensesData],
    isUsingTestData: true,
  });

  useEffect(() => {
    if (expensesState.expenses.length === 0) {
      setExpense(dummyExpensesData);
    }
  }, [expensesState.expenses]);

  function addExpense(expense: Expense) {
    dispatch({ type: "ADD_EXPENSE", payload: expense });
  }

  function deleteExpense(id: number | string) {
    dispatch({ type: "DELETE_EXPENSE", payload: id });
  }

  function updateExpense(expense: Expense) {
    dispatch({ type: "UPDATE_EXPENSE", payload: expense });
  }

  function setExpense(expenses: Expense[]) {
    dispatch({ type: "SET_EXPENSE", payload: expenses });
  }

  function setTestDataUsage(isUsingTestData: boolean) {
    dispatch({ type: "SET_TEST_DATA_USAGE", payload: isUsingTestData });
  }

  const value = {
    expenses: expensesState.expenses,
    isUsingTestData: expensesState.isUsingTestData ?? false,
    addExpense,
    deleteExpense,
    updateExpense,
    setExpense,
    setTestDataUsage,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}
