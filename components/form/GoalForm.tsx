import { Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import globalStyles from "../../constants/globalStyles";
import {
  budgetGoalValidationSchema,
  depositGoalValidationSchema,
} from "../../constants/schema";
import FormTextInput from "./FormTextInput";
import CustomButton from "../ui/CustomButton";
import { GoalContext } from "../../store/goal-context";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../../firebaseConfig";

interface GoalFormProps {
  initialValues: { budgetGoal?: number; depositGoal?: number };
  goalType: "deposit" | "budget";
  afterSubmitFunction: () => void;
}

interface FormValues {
  budgetGoal?: number;
  depositGoal?: number;
}

export const GoalForm: React.FC<GoalFormProps> = ({
  initialValues,
  goalType,
  afterSubmitFunction,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { userEmail, docId, setDocId, setBudgetGoal, setDepositGoal } =
    useContext(GoalContext);

  useEffect(() => {
    const checkDocId = async () => {
      if (!docId) {
        const querySnapshot = await getDocs(
          query(
            collection(FIRESTORE_DB, "goals"),
            where("userEmail", "==", userEmail)
          )
        );

        const firstDoc = querySnapshot.docs[0];
        setDocId(firstDoc.id);
      }
    };

    checkDocId();
  }, []);

  const goalFieldName = goalType === "budget" ? "budgetGoal" : "depositGoal";
  const formTitle =
    goalType === "budget"
      ? `Budget: $${Number(initialValues.budgetGoal.toFixed(2))}`
      : `Deposit: $${Number(initialValues.depositGoal.toFixed(2))}`;
  const buttonText =
    goalType === "budget" ? "Update Budget Goal" : "Update Deposit Goal";

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={
        goalType === "budget"
          ? budgetGoalValidationSchema
          : depositGoalValidationSchema
      }
      onSubmit={async (values: FormValues) => {
        setIsLoading(true);
        try {
          const docRef = doc(FIRESTORE_DB, "goals", docId);
          if (goalType === "budget") {
            await updateDoc(docRef, { budgetGoal: values.budgetGoal });
            setBudgetGoal(values.budgetGoal);
          } else {
            await updateDoc(docRef, { depositGoal: values.depositGoal });
            setDepositGoal(values.depositGoal);
          }
          afterSubmitFunction();
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {({ handleSubmit }) => (
        <View style={{ width: "100%" }}>
          <Text style={globalStyles.formTitle}>{formTitle}</Text>
          <FormTextInput
            placeholder="Enter new goal"
            name={goalFieldName}
            keyboardType="number-pad"
          />
          <CustomButton
            buttonText={buttonText}
            onPress={handleSubmit}
            style={{ width: "100%", marginBottom: 20, marginTop: 10 }}
            isLoading={isLoading}
          />
        </View>
      )}
    </Formik>
  );
};
