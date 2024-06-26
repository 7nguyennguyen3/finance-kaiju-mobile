import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import globalStyles from "../constants/globalStyles";
import { monthNames } from "../constants/types";
import { colors } from "../constants/colors";

interface MonthSwitchProps {
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth?: React.Dispatch<React.SetStateAction<number>>;
  setSelectedYear?: React.Dispatch<React.SetStateAction<number>>;
}

const MonthSwitch = ({
  goToPreviousMonth,
  goToNextMonth,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
}: MonthSwitchProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleConfirm = (month: number, year: number) => {
    if (setSelectedMonth && setSelectedYear) {
      setSelectedMonth(month);
      setSelectedYear(year);
    }
  };

  const onChange = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      setIsModalVisible(false);
    }
    if (event.type === "dismissed") {
      setIsModalVisible(false);
    }
  };

  useEffect(() => {
    if (!isModalVisible) {
      const selectedMonth = date.getMonth();
      const selectedYear = date.getFullYear();
      handleConfirm(selectedMonth, selectedYear);
    }
  }, [isModalVisible]);

  return (
    <View
      style={{
        alignItems: "center",
        marginVertical: 20,
      }}
    >
      <View
        style={{
          width: "70%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Pressable onPress={goToPreviousMonth}>
          <Ionicons name="caret-back" size={30} />
        </Pressable>
        <Pressable
          onPress={() => setIsModalVisible(true)}
          style={({ pressed }) => [pressed && { opacity: 0.5 }]}
        >
          <Text
            style={[
              globalStyles.title,
              {
                fontSize: 20,
                fontWeight: "bold",
              },
            ]}
          >
            {monthNames[selectedMonth]} {selectedYear}
          </Text>
        </Pressable>
        <Pressable
          onPress={goToNextMonth}
          disabled={
            selectedMonth === new Date().getMonth() &&
            selectedYear === new Date().getFullYear()
          }
        >
          <Ionicons
            name="caret-forward"
            size={30}
            color={
              selectedMonth === new Date().getMonth() &&
              selectedYear === new Date().getFullYear()
                ? "grey"
                : "black"
            }
          />
        </Pressable>
      </View>
      {isModalVisible && (
        <DateTimePicker
          maximumDate={new Date()}
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default MonthSwitch;
