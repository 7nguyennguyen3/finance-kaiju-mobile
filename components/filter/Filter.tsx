import { Pressable, StyleSheet, Text, FlatList, View } from "react-native";
import { colors } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { categories } from "../../constants/types";

type FilterButtonProps = {
  onPress: () => void;
  selected?: boolean;
  text: string;
};

type FilterListProps = {
  data: any[];
  icon?: true;
  selectedItem: any;
  setSelectedItem: (item: any) => void;
  setAllItemsSelected: (selected: boolean) => void;
};

const FilterButton = ({ onPress, selected, text }: FilterButtonProps) => (
  <Pressable
    onPress={onPress}
    style={{
      width: "80%",
      borderWidth: 2,
      borderColor: colors.primary800,
      padding: 5,
      margin: 5,
      backgroundColor: selected ? colors.primary800 : "transparent",
      marginVertical: 10,
    }}
  >
    <Text style={[styles.modalText, { color: selected ? "white" : "black" }]}>
      {text}
    </Text>
  </Pressable>
);

const FilterList = ({
  data,
  selectedItem,
  setSelectedItem,
  icon,
  setAllItemsSelected,
}: FilterListProps) => (
  <FlatList
    style={{ flexGrow: 0, marginVertical: 10 }}
    numColumns={2}
    data={data}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => (
      <Pressable
        onPress={() => {
          setSelectedItem(item);
          setAllItemsSelected(false);
        }}
        style={{
          ...styles.filterSelection,
          backgroundColor:
            item === selectedItem ? colors.primary800 : "transparent",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={[
              styles.modalText,
              {
                color: item === selectedItem ? "white" : "black",
              },
            ]}
          >
            {item.charAt(0) + item.slice(1).toLowerCase()}
          </Text>
          {icon && (
            <Ionicons
              name={categories[item].icon}
              size={24}
              color={categories[item].color}
            />
          )}
        </View>
      </Pressable>
    )}
  />
);

export { FilterButton, FilterList };

const styles = StyleSheet.create({
  modalText: {
    textAlign: "center",
    fontSize: 16,
  },
  filterSelection: {
    width: "46%",
    borderWidth: 2,
    borderColor: colors.primary800,
    padding: 5,
    margin: 5,
    alignSelf: "center",
  },
});
