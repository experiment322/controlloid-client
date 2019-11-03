import { DarkTheme } from "react-native-paper";

export default {
  ...DarkTheme,
  name: "Dark",
  mode: "exact",
  colors: {
    ...DarkTheme.colors,
    primary: "#b7ff5c",
  },
};
