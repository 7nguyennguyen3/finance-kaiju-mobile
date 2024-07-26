import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface LoadingSkeletonProps {
  itemCount?: number;
  height?: number;
  style?: ViewStyle;
  marginVertical?: number;
}

const SkeletonItem: React.FC<{
  height: number;
  style?: ViewStyle;
  marginVertical: number;
}> = ({ height, style, marginVertical }) => {
  return (
    <View
      style={[
        styles.skeletonText,
        {
          height,
          marginVertical: marginVertical || 7,
        },
        style,
      ]}
    />
  );
};

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  itemCount = 5,
  height = 30,
  marginVertical = 7,
  style,
}) => {
  return (
    <View style={[style]}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <SkeletonItem
          key={index}
          height={height}
          marginVertical={marginVertical}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonText: {
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginVertical: 7,
    marginHorizontal: 5, // Add horizontal margin for spacing between items
    flex: 1, // Allow items to grow and fill the row
  },
});

export default LoadingSkeleton;
