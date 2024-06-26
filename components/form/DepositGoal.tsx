import { Formik } from "formik";
import React from "react";
import { Text, View } from "react-native";
import globalStyles from "../../constants/globalStyles";
import { depositGoalValidationSchema } from "../../constants/schema";
import FormTextInput from "../form/FormTextInput";
import CustomButton from "../ui/CustomButton";

interface DepositGoalFormProps {
  initialValues: { depositGoal: number };
  onSubmit: (values: { depositGoal: number }) => void;
}

export const DepositGoalForm: React.FC<DepositGoalFormProps> = ({
  initialValues,
  onSubmit,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={depositGoalValidationSchema}
    onSubmit={onSubmit}
  >
    {({ handleSubmit }) => (
      <View
        style={{
          width: "100%",
        }}
      >
        <Text style={globalStyles.formTitle}>Deposit Goal</Text>
        <FormTextInput
          placeholder="Enter new deposit goal"
          name="depositGoal"
          keyboardType="number-pad"
        />
        <CustomButton
          buttonText="Update Deposit Goal"
          onPress={handleSubmit}
          style={{ width: "100%", marginBottom: 20, marginTop: 10 }}
        />
      </View>
    )}
  </Formik>
);
