import { StyleSheet } from "react-native";

export default StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  fullScreen: {
    flex: 1,
    backgroundColor: "black",
  },
  elevate: {
    elevation: 1,
    marginBottom: 16,
  },
  pickerModal: {
    margin: 16,
    padding: 8,
    borderRadius: 8,
  },
  preferenceCard: {
    padding: 8,
    marginVertical: 8,
  },
  flexOne: {
    flex: 1,
  },
  flexGrowOne: {
    flexGrow: 1,
  },
  centeredText: {
    fontSize: 18,
    textAlign: "center",
  },
  centeredContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  absoluteFill: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "absolute",
  },
});
