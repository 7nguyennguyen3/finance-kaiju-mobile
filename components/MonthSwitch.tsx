import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "../constants/colors";
import globalStyles from "../constants/globalStyles";
import { monthNames } from "../constants/types";
import globalStore from "../store/store";

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
  const { addMonthData } = globalStore();

  useEffect(() => {
    if (!isModalVisible) {
      const selectedMonth = date.getMonth();
      const selectedYear = date.getFullYear();
      handleConfirm(selectedMonth, selectedYear);
      const fetchedDate = `${date.getMonth() + 1}/${date.getFullYear()}`;
      addMonthData(fetchedDate);
    }
  }, [isModalVisible]);

  const handleConfirm = (month: number, year: number) => {
    if (setSelectedMonth && setSelectedYear) {
      setSelectedMonth(month);
      setSelectedYear(year);
    }
  };

  const onChange = async (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      setIsModalVisible(false);
    }
    if (event.type === "dismissed") {
      setIsModalVisible(false);
    }
  };

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
        {/* <Pressable
          onPress={() => {
            setFetchedMonthData([]);
          }}
        >
          <Text>Clear Month Array</Text>
        </Pressable> */}
        <Pressable onPress={goToPreviousMonth}>
          <Ionicons name="caret-back" size={30} />
        </Pressable>
        <Pressable
          onPress={() => setIsModalVisible(true)}
          style={({ pressed }) => [
            pressed && { opacity: 0.5 },
            {
              flexDirection: "row",
              alignItems: "center",
            },
          ]}
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
          <Ionicons
            name="calendar"
            size={23}
            color={colors.blue900}
            style={{ marginLeft: 7 }}
          />
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
