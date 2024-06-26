import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { User } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import CustomAlert from "./components/ui/CustomAlert";
import LoadingOverlay from "./components/ui/LoadingOverlay";
import { colors } from "./constants/colors";
import { Expense } from "./constants/types";
import { FIREBASE_AUTH, FIRESTORE_DB } from "./firebaseConfig";
import Account from "./screens/Account";
import AddExpense from "./screens/AddExpense";
import AllExpenses from "./screens/AllExpenses";
import EmailVerify from "./screens/EmailVerify";
import Introduction from "./screens/Introduction";
import LatestSummary from "./screens/LatestSummary";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Stats from "./screens/Stats";
import ExpensesContextProvider, {
  ExpensesContext,
} from "./store/expenses-context";
import GoalContextProvider, { GoalContext } from "./store/goal-context";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

export function App() {
  const { setExpense, isUsingTestData, setTestDataUsage } =
    useContext(ExpensesContext);
  const { isEmailVerified, setIsEmailVerified } = useContext(GoalContext);
  const { setUserEmail } = useContext(GoalContext);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showCustomAlert, setShowCustomAlert] = useState(false);

  useEffect(() => {
    FIREBASE_AUTH.onAuthStateChanged((user) => {
      setUser(user);

      if (!user || !isEmailVerified) {
        setIsLoading(false);
      }

      if (user?.emailVerified) {
        setIsEmailVerified(true);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      setIsEmailVerified(user.emailVerified);
    } else {
      setIsEmailVerified(false);
    }
  }, [user]);

  useEffect(() => {
    if (isEmailVerified && user) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          setUserEmail(user.email);
          const querySnapshot = await getDocs(
            query(
              collection(FIRESTORE_DB, "records"),
              where("userEmail", "==", user.email)
            )
          );
          const dataList: Expense[] = [];
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              dataList.push({ id: doc.id, ...doc.data() } as Expense);
            });
          }
          if (dataList.length > 0) {
            setExpense(dataList);
            setTestDataUsage(false);
          } else {
            setShowCustomAlert(true);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [isUsingTestData, isEmailVerified]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!isEmailVerified) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        >
          <Stack.Screen name="Introduction" component={Introduction} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="EmailVerify" component={EmailVerify} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      {showCustomAlert && (
        <CustomAlert
          title="Notice"
          descriptions={[
            "Dummy date in use!",
            "Please add a record to remove it.",
            "App is not yet functional when offline.",
          ]}
          okText="OK"
          onPressOk={() => setShowCustomAlert(false)}
        />
      )}
      <NavigationContainer>
        <BottomTab.Navigator
          screenOptions={({ route }) => ({
            headerStyle: {
              backgroundColor: colors.primary500,
            },
            headerTintColor: "#fff",
            headerShown: false,
            tabBarActiveBackgroundColor: colors.primary500,
            tabBarActiveTintColor: "#fff",
            tabBarLabel: () => null,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName:
                | "home"
                | "home-outline"
                | "list"
                | "add-circle"
                | "add-circle-outline"
                | "list-outline"
                | "analytics"
                | "analytics-outline"
                | "person"
                | "person-outline"
                | undefined;

              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "All Expenses") {
                iconName = focused ? "list" : "list-outline";
              } else if (route.name === "Add Expense") {
                iconName = focused ? "add-circle" : "add-circle-outline";
              } else if (route.name === "Stats") {
                iconName = focused ? "analytics" : "analytics-outline";
              } else if (route.name === "Account") {
                iconName = focused ? "person" : "person-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <BottomTab.Screen
            name="Home"
            component={LatestSummary}
            options={{
              headerShown: false,
            }}
          />
          <BottomTab.Screen name="Stats" component={Stats} />
          <BottomTab.Screen name="Add Expense" component={AddExpense} />
          <BottomTab.Screen name="All Expenses" component={AllExpenses} />
          <BottomTab.Screen name="Account" component={Account} />
        </BottomTab.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function AppWrapper() {
  return (
    <ExpensesContextProvider>
      <GoalContextProvider>
        <App />
      </GoalContextProvider>
    </ExpensesContextProvider>
  );
}
