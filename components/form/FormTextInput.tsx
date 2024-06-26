import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import globalStyles from "../../constants/globalStyles";
import { FormikValues, useFormikContext } from "formik";

interface FormTextInputProps extends TextInputProps {
  name: string;
  keyboardType?:
    | "default"
    | "number-pad"
    | "decimal-pad"
    | "numeric"
    | "email-address"
    | "phone-pad";
  secureTextEntry?: boolean;
}

const FormTextInput = ({
  placeholder,
  name,
  keyboardType,
  secureTextEntry,
}: FormTextInputProps) => {
  const { handleChange, handleBlur, values, errors, touched } =
    useFormikContext<FormikValues>();

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={globalStyles.input}
        placeholder={placeholder}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        value={values[name]}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
      {touched[name] && errors[name] && typeof errors[name] === "string" && (
        <Text style={globalStyles.errorText}>{errors[name]}</Text>
      )}
    </View>
  );
};

export default FormTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 10,
    width: "100%",
  },
});
