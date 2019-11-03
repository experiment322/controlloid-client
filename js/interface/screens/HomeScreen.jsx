import React from "react";
import { Surface, Text, withTheme } from "react-native-paper";
import { Linking, Platform, ScrollView } from "react-native";
import Styles from "../styles";
import * as Types from "../../types";

const fontFamily = Platform.OS === "ios" ? "Courier" : "monospace";

const HomeScreen = ({ theme }) => (
  <Surface style={Styles.screen}>
    <ScrollView overScrollMode="never">
      <Text style={{ fontFamily }}>
        {"\nWelcome to Controlloid!\n\n\n" +
          "This application allows you to use your phone as a real game controller." +
          " Follow the steps below to get started.\n\n" +
          "#1\nGo to Layouts screen to create, edit and star a layout.\n\n" +
          "#2\nStart the server on your PC and make sure that the phone and" +
          " the computer are on the same network for optimal performance" +
          " (USB Tethering > Bluetooth PAN > WiFi).\n\n" +
          "#3\nGo to Controller screen, write the IP address of your PC" +
          " (must begin with http://) and press CONNECT." +
          " You can also scan for LAN servers by pulling down on the screen.\n\n" +
          "#4\nTo change the theme or tweak the controls go to Preferences screen.\n" +
          "> [Analog dead zone] - size of the square in which analog events are not reported to the server.\n" +
          "> [Analog stick range] - maximum absolute value reported to the server by the analog controls.\n" +
          "> [Socket minimum latency] - time frame in which analog events are dropped and not sent to the server.\n\n" +
          "#5\nDone!\n\n\n" +
          "Visit the following link to download the server application:"}
      </Text>
      <Text
        style={{ fontFamily, color: theme.colors.accent }}
        onPress={() => Linking.openURL("https://github.com/experiment322/controlloid-server")}
      >
        {"\nhttps://github.com/experiment322/controlloid-server\n"}
      </Text>
      <Text style={{ fontFamily }}>
        {"\nTo start the server run:\n" +
          "[Linux] ./dist/linux/start.sh\n" +
          "[Windows] ./dist/windows/start.bat\n\n"}
      </Text>
    </ScrollView>
  </Surface>
);

HomeScreen.propTypes = {
  theme: Types.applicationTheme.isRequired,
};

export default withTheme(HomeScreen);
