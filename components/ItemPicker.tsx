import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { colors } from "../constants/colors";
import { categories, expenseCategories } from "../constants/types";
import { Ionicons } from "@expo/vector-icons";
import globalStyles from "../constants/globalStyles";

interface Item {
  label: string;
  value: string;
}

const data: Item[] = expenseCategories.map((category) => ({
  label: category,
  value: category,
}));

interface ItemPickerProps {
  selectedValue: string | null;
  onValueChange: (value: string) => void;
}

const ItemPicker = ({ selectedValue, onValueChange }: ItemPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  const selectedCategoryIcon = selectedValue
    ? categories[selectedValue]?.icon
    : null;

  const selectedCategoryColor = selectedValue
    ? categories[selectedValue]?.color
    : null;

  return (
    <View>
      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {selectedCategoryIcon && (
            <Ionicons
              name={selectedCategoryIcon}
              size={24}
              color={selectedCategoryColor || colors.zinc900}
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={styles.buttonText}>
            {selectedValue || "Select a category"}
          </Text>
        </View>
      </Pressable>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: "100%",
              height: "100%",
            }}
          >
            <Pressable
              onPress={() => setModalVisible(false)}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? "rgba(0, 0, 0, 0.1)"
                    : "transparent",
                },
              ]}
            >
              <Text style={{ textAlign: "right", padding: 10 }}>
                <Ionicons name="close" size={24} color={colors.primary500} />
              </Text>
            </Pressable>

            <FlatList
              data={data}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                // Determine the icon and color for each category
                const categoryIcon =
                  categories[item.value]?.icon || "help-circle";
                const categoryColor = categories[item.value]?.color || "#000";

                return (
                  <Pressable
                    onPress={() => handleSelect(item.value)}
                    style={({ pressed }) => [
                      globalStyles.expenseContainer,
                      {
                        backgroundColor: pressed
                          ? "rgba(0, 0, 0, 0.1)"
                          : "transparent",
                      },
                    ]}
                  >
                    <Text>{item.label}</Text>
                    <Ionicons
                      name={categoryIcon}
                      size={24}
                      color={categoryColor}
                    />
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ItemPicker;

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: colors.primary500,
    padding: 10,
  },
  buttonText: {
    textAlign: "left",
  },
});
