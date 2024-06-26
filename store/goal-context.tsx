import { createContext, useEffect, useReducer } from "react";

interface GoalContextProps {
  docId: string;
  budgetGoal: number;
  depositGoal: number;
  userEmail: string;
  isEmailVerified: boolean;
  setBudgetGoal: (goal: number) => void;
  setDepositGoal: (goal: number) => void;
  setUserEmail: (email: string) => void;
  setDocId: (docId: string) => void;
  setIsEmailVerified: (isVerified: boolean) => void;
}

export interface GoalState {
  docId: string;
  budgetGoal: number;
  depositGoal: number;
  userEmail: string;
  isEmailVerified: boolean;
}

export const GoalContext = createContext<GoalContextProps>({
  docId: "",
  budgetGoal: 0,
  depositGoal: 0,
  userEmail: "",
  isEmailVerified: false,
  setBudgetGoal: () => {},
  setDepositGoal: () => {},
  setUserEmail: () => {},
  setDocId: () => {},
  setIsEmailVerified: () => {},
});

function goalReducer(state: GoalState, action: { type: string; payload: any }) {
  switch (action.type) {
    case "SET_DOC_ID":
      return { ...state, docId: action.payload };
    case "SET_BUDGET_GOAL":
      return { ...state, budgetGoal: Number(action.payload) };
    case "SET_DEPOSIT_GOAL":
      return { ...state, depositGoal: Number(action.payload) };
    case "SET_USER_EMAIL":
      return { ...state, userEmail: action.payload };
    case "SET_IS_EMAIL_VERIFIED":
      return { ...state, isEmailVerified: action.payload };
    default:
      return state;
  }
}

export default function GoalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(goalReducer, {
    docId: "",
    budgetGoal: 1500,
    depositGoal: 2000,
    userEmail: "",
    isEmailVerified: false,
  });

  const setBudgetGoal = (goal: number) =>
    dispatch({ type: "SET_BUDGET_GOAL", payload: goal });
  const setDepositGoal = (goal: number) =>
    dispatch({ type: "SET_DEPOSIT_GOAL", payload: goal });
  const setUserEmail = (email: string) =>
    dispatch({ type: "SET_USER_EMAIL", payload: email });
  const setDocId = (docId: string) =>
    dispatch({ type: "SET_DOC_ID", payload: docId });
  const setIsEmailVerified = (isVerified: boolean) =>
    dispatch({ type: "SET_IS_EMAIL_VERIFIED", payload: isVerified });

  return (
    <GoalContext.Provider
      value={{
        ...state,
        setBudgetGoal,
        setDepositGoal,
        setUserEmail,
        setDocId,
        setIsEmailVerified,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
}
