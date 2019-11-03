import { StyleSheet } from "react-native";

export default StyleSheet.create({
  overlayContainer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const buildContainerStyle = (x, y, size) => ({
  top: y,
  left: x,
  width: size,
  height: size,
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
});
