import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Alert, Pressable, Text, View, ViewStyle } from "react-native";
import { colors } from "../../constants/colors";
import { dummyExpensesData } from "../../constants/dummyData";
import globalStyles from "../../constants/globalStyles";
import { validationSchema } from "../../constants/schema";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import { ExpensesContext } from "../../store/expenses-context";
import ItemPicker from "../ItemPicker";
import CustomButton from "../ui/CustomButton";
import FormTextInput from "./FormTextInput";

type ExpenseData = {
  expenseDescription: string;
  expenseAmount: string;
  category: string;
};

type ExpenseFormProps = {
  initialData?: ExpenseData;
  isUpdating?: boolean;
  style?: ViewStyle;
  expenseId?: string;
  onClose?: () => void;
};

let pickedDate = new Date();

export const ExpenseForm = ({
  initialData = {
    expenseDescription: "",
    expenseAmount: "",
    category: "",
  },
  isUpdating,
  style,
  expenseId,
  onClose,
}: ExpenseFormProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(
    initialData?.category || null
  );
  const [selectedDateState, setSelectedDateState] = useState<Date>(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    addExpense,
    setTestDataUsage,
    setExpense,
    updateExpense,
    deleteExpense,
    isUsingTestData,
    expenses,
  } = useContext(ExpensesContext);
  const { navigate } = useNavigation();

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
  };

  const onChange = (event: any, selectedDate?: Date) => {
    if (event.type === "set") {
      const currentDate = selectedDate || selectedDateState;
      pickedDate = currentDate;
      setIsModalVisible(false);
    } else if (event.type === "dismissed") {
      setIsModalVisible(false);
    }
  };

  useEffect(() => {
    if (!isModalVisible) {
      setSelectedDateState(pickedDate);
    }
  }, [isModalVisible]);

  const deleteRecord = async () => {
    Alert.alert(
      "Delete Record",
      `${
        expenses.length === 1
          ? "Removing this record will return test data. Are you sure? "
          : "Are you sure you want to delete this record?"
      }`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            setIsDeleting(true);
            try {
              const expenseRef = doc(FIRESTORE_DB, "records", expenseId);
              await deleteDoc(expenseRef);
              if (expenses.length === 1) {
                setExpense(dummyExpensesData);
                setTestDataUsage(true);
              }
              deleteExpense(expenseId);
              onClose();
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to delete the record. Please try again later."
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const user = FIREBASE_AUTH.currentUser;

  return (
    <Formik
      initialValues={initialData}
      validationSchema={validationSchema}
      onSubmit={async (
        { category, expenseAmount, expenseDescription },
        { resetForm }
      ) => {
        setIsLoading(true);
        try {
          const selectedDate = selectedDateState || new Date();
          const newExpense = {
            category,
            amount: parseFloat(expenseAmount),
            description: expenseDescription,
            date: selectedDate.toISOString(),
            userEmail: user?.email,
            month: selectedDate.getMonth() + 1,
            year: selectedDate.getFullYear(),
          };

          if (isUpdating) {
            const expenseRef = doc(FIRESTORE_DB, "records", expenseId);
            await updateDoc(expenseRef, newExpense);
            updateExpense({ ...newExpense, id: expenseId });
            onClose();
          } else {
            const newDoc = await addDoc(collection(FIRESTORE_DB, "records"), {
              ...newExpense,
            });
            addExpense({ ...newExpense, id: newDoc.id });
            setTestDataUsage(false);
          }

          resetForm();
          setSelectedValue(null);
          navigate("Home" as never);
        } catch (error) {
          Alert.alert(
            "Error",
            "An error occurred while processing your request. Please try again later."
          );
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {({ handleSubmit, errors, handleChange }) => (
        <View style={[globalStyles.container, style]}>
          <Text
            style={[globalStyles.title, { marginTop: 20, alignSelf: "center" }]}
          >
            {isUpdating ? "Edit Record" : "Add a New Record!"}
          </Text>
          <Pressable
            onPress={() => setIsModalVisible(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            <Ionicons name="calendar" size={26} color={colors.blue900} />
            <Text style={{ marginHorizontal: 10, fontWeight: "bold" }}>
              {selectedDateState.toLocaleDateString()}
            </Text>
          </Pressable>
          <FormTextInput
            name="expenseDescription"
            placeholder="Description (optional)"
          />
          <FormTextInput
            name="expenseAmount"
            placeholder="Amount"
            keyboardType="number-pad"
          />
          <View style={{ marginVertical: 10 }}>
            <ItemPicker
              onValueChange={(value) => {
                handleValueChange(value);
                handleChange("category")(value);
              }}
              selectedValue={selectedValue}
            />
            {typeof errors.category === "string" && (
              <Text style={globalStyles.errorText}>{errors.category}</Text>
            )}
          </View>
          <View
            style={{
              marginVertical: 20,
            }}
          >
            <CustomButton
              buttonText="Submit"
              onPress={handleSubmit}
              isLoading={isLoading}
            />
            {isUpdating && (
              <CustomButton
                buttonText="Delete Record"
                buttonColor={colors.error500}
                onPress={deleteRecord}
                style={{
                  marginTop: 30,
                }}
                isLoading={isDeleting}
              />
            )}
          </View>
          {isModalVisible && (
            <DateTimePicker
              maximumDate={new Date()}
              value={selectedDateState}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
        </View>
      )}
    </Formik>
  );
};
