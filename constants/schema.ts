import * as Yup from "yup";
import Filter from "bad-words";

const filter = new Filter();

export const validationSchema = Yup.object().shape({
  expenseDescription: Yup.string().optional(),
  expenseAmount: Yup.number()
    .typeError("Amount must be a valid number with up to 2 decimal places") // Custom type error message
    .positive("Amount must be a positive number")
    .test(
      "is-decimal",
      "Amount must be a number with up to 2 decimal places",
      (value) =>
        typeof value === "number" &&
        (value + "").match(/^[0-9]+(\.[0-9]{1,2})?$/) !== null
    )
    .required("Amount is required"),
  category: Yup.string().required("Category is required"),
});

export const signInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .required("Password is required"),
});

export const signUpSchema = Yup.object().shape({
  username: Yup.string()
    .required("Name is required")
    .test("no-bad-words", "Name contains inappropriate words", (value) => {
      return !filter.isProfane(value);
    }),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .required("Password is required"),
});

export const goalValidationSchema = Yup.object().shape({
  depositGoal: Yup.number()
    .required("Deposit goal is required")
    .positive("Deposit goal must be positive"),
  budgetGoal: Yup.number()
    .required("Budget goal is required")
    .positive("Budget goal must be positive"),
});

export const depositGoalValidationSchema = Yup.object().shape({
  depositGoal: Yup.number()
    .required("Deposit goal is required")
    .positive("Deposit goal must be positive"),
});

export const budgetGoalValidationSchema = Yup.object().shape({
  budgetGoal: Yup.number()
    .required("Budget goal is required")
    .positive("Budget goal must be positive"),
});

export const passwordResetSchema = Yup.object().shape({
  passwordResetEmail: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
});
