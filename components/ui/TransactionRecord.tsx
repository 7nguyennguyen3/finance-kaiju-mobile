import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { colors } from "../../constants/colors";
import globalStyles from "../../constants/globalStyles";
import { categories, Expense } from "../../constants/types";
import { ExpenseForm } from "../form/ExpenseForm";
import CustomAlert from "./CustomAlert";

const TransactionRecord = ({
  displayExpenses,
}: {
  displayExpenses: Expense[];
}) => {
  const swipeableRef = useRef<Swipeable | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Expense | null>(null);
  const [swipeableKeys, setSwipeableKeys] = useState<{ [key: string]: number }>(
    {}
  );
  const [showCustomAlert, setShowCustomAlert] = useState(false);

  const resetSwipeable = (id: string) => {
    setSwipeableKeys((prevKeys) => ({
      ...prevKeys,
      [id]: (prevKeys[id] || 0) + 1,
    }));
  };

  return (
    <>
      <FlatList
        data={displayExpenses}
        renderItem={({ item }: { item: Expense }) => {
          const categoryKey =
            item.category.toUpperCase() as keyof typeof categories;
          const category = categories[categoryKey];

          const date = new Date(item.date);

          const formattedDate = `${date.toLocaleString("default", {
            month: "long",
          })} ${date.getDate()}`;

          const swipeableKey = swipeableKeys[item.id] || 0;

          return (
            <GestureHandlerRootView>
              <Swipeable
                ref={swipeableRef}
                key={swipeableKey}
                overshootFriction={10}
                renderLeftActions={() => (
                  <View
                    style={[
                      styles.actionBorder,
                      {
                        borderColor: colors.accent500,
                        backgroundColor: colors.accent500,
                      },
                    ]}
                  >
                    <Ionicons name="bulb-outline" size={24} color="white" />
                  </View>
                )}
                renderRightActions={() => (
                  <View
                    style={[
                      styles.actionBorder,
                      {
                        borderColor: colors.primary800,
                        backgroundColor: colors.primary800,
                      },
                    ]}
                  >
                    <Ionicons name="create-outline" size={24} color="white" />
                  </View>
                )}
                onSwipeableOpen={(direction) => {
                  if (direction === "left") {
                    setSelectedItem(item);
                    setShowCustomAlert(true);
                  } else if (direction === "right") {
                    setSelectedItem(item);
                    if (!modalVisible) {
                      setModalVisible(true);
                    }
                  }
                }}
              >
                <View style={globalStyles.expenseContainer}>
                  <Text
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    ${item.amount}
                  </Text>
                  <View style={styles.recordSpecContainer}>
                    <Text style={styles.dateText}>{formattedDate}</Text>
                    <Ionicons
                      name={category?.icon || "help-circle"}
                      size={24}
                      color={category?.color || colors.primary500}
                    />
                  </View>
                </View>
              </Swipeable>
            </GestureHandlerRootView>
          );
        }}
        keyExtractor={(item: Expense, index: number) => `${item.id}${index}`}
      />
      {selectedItem && showCustomAlert && (
        <CustomAlert
          title="Insight"
          descriptions={[
            `Total: $${selectedItem.amount}`,
            selectedItem.description
              ? `Description: ${selectedItem.description}`
              : "No description provided",
            `Category: ${selectedItem.category}`,
            `Date: ${new Date(selectedItem.date).toLocaleDateString()}`,
          ]}
          okText="OK"
          onPressOk={() => {
            setShowCustomAlert(false);
            resetSwipeable(selectedItem.id.toString());
          }}
        />
      )}
      {selectedItem && (
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalView}>
            <Pressable
              style={{ alignSelf: "flex-end", marginBottom: 10 }}
              onPress={() => {
                setModalVisible(false);
                swipeableRef.current?.close();
              }}
            >
              <Ionicons name="close" size={30} color={colors.error500} />
            </Pressable>

            <ExpenseForm
              isUpdating
              style={{ width: "100%" }}
              initialData={{
                category: selectedItem.category,
                expenseAmount: selectedItem.amount.toString(),
                expenseDescription: selectedItem.description!,
              }}
              expenseId={selectedItem.id.toString()}
              onClose={() => {
                setModalVisible(false);
                resetSwipeable(selectedItem.id.toString());
              }}
            />
          </View>
        </Modal>
      )}
    </>
  );
};

export default TransactionRecord;

const styles = StyleSheet.create({
  recordSpecContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 11,
    marginRight: 10,
    fontWeight: "bold",
  },
  actionBorder: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginVertical: 5,
    borderWidth: 2,
  },
  modalView: {
    flex: 1,
    backgroundColor: "white",
    opacity: 0.95,
    borderRadius: 5,
    padding: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
