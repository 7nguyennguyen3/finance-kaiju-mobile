import React from "react";
import { View, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";

interface PaginationProps {
  page: number;
  maxPage: number;
  setPage: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  page,
  maxPage,
  setPage,
}) => {
  // Ensure maxPage is at least 1
  const safeMaxPage = Math.max(maxPage, 1);

  const handlePreviousPage = () => {
    const newPage = Math.max(page - 1, 1);
    setPage(newPage);
  };

  const handleNextPage = () => {
    const newPage = Math.min(page + 1, safeMaxPage);
    setPage(newPage);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Page {page} of {safeMaxPage}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Pressable onPress={handlePreviousPage} disabled={page === 1}>
          <Ionicons
            name="chevron-back-circle"
            size={32}
            color={page === 1 ? "gray" : colors.primary800}
          />
        </Pressable>
        <Pressable onPress={handleNextPage} disabled={page === safeMaxPage}>
          <Ionicons
            name="chevron-forward-circle"
            size={32}
            color={page === safeMaxPage ? "gray" : colors.primary800}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default PaginationComponent;
