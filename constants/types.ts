import { Dimensions } from "react-native";

export type Expense = {
  amount: number;
  category: string;
  credentialsEmail?: string | null;
  date: string;
  description?: string;
  id: number | string;
  userEmail?: string | null;
};

type IconName =
  | "fast-food"
  | "gift"
  | "flash"
  | "school"
  | "game-controller"
  | "bus"
  | "home"
  | "ellipsis-horizontal-outline"
  | "cash"
  | "trending-up"
  | "search"
  | "repeat"
  | "link"
  | "at"
  | "logo-usd"
  | "body"
  | "help-circle";

type Category = {
  icon: IconName;
  color: string;
};

export const expenseCategories = [
  "FOOD",
  "GIFT",
  "UTILITIES",
  "EDUCATION",
  "ENTERTAINMENT",
  "TRANSPORTATION",
  "HOUSING",
  "MISCELLANEOUS",
  "INCOME",
  "PROFIT",
];

export const categories: { [key: string]: Category } = {
  FOOD: { icon: "fast-food", color: "#FF4500" }, // Orange
  GIFT: { icon: "gift", color: "#0000FF" }, // Blue
  UTILITIES: { icon: "flash", color: "#800000" }, // Maroon
  EDUCATION: { icon: "school", color: "#800080" }, // Purple
  ENTERTAINMENT: { icon: "game-controller", color: "#FF00FF" }, // Magenta
  TRANSPORTATION: { icon: "bus", color: "#000080" }, // Navy
  HOUSING: { icon: "home", color: "#FFA500" }, // Orange
  MISCELLANEOUS: { icon: "ellipsis-horizontal-outline", color: "#8B4513" }, // SaddleBrown
  INCOME: { icon: "cash", color: "#D2691E" }, // Chocolate
  PROFIT: { icon: "logo-usd", color: "#DC143C" }, // Crimson
};

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const date = new Date();
export const thisMonth = date.toLocaleString("default", { month: "long" });
date.setMonth(date.getMonth() - 1);
export const lastMonth = date.toLocaleString("default", { month: "long" });
date.setMonth(date.getMonth() - 1);
export const twoMonthsAgo = date.toLocaleString("default", { month: "long" });

export const screenWidth = Dimensions.get("window").width;
export const screenHeight = Dimensions.get("window").height;
