import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Drawer, Surface } from "react-native-paper";
import Styles from "../styles";
import * as Types from "../../types";

const insets = {
  top: "always",
  horizontal: "never",
};

const NavigatorDrawerContainer = ({ items, activeItemKey, getLabel, renderIcon, onItemPress }) => (
  <ScrollView contentContainerStyle={Styles.flexGrowOne} overScrollMode="never">
    <SafeAreaView style={Styles.flexOne} forceInset={insets}>
      <Surface style={Styles.flexOne}>
        {items.map((route, index) => {
          const focused = activeItemKey === route.key;
          const scene = {
            route,
            index,
            focused,
          };
          return (
            <Drawer.Item
              key={route.key}
              icon={renderIcon(scene)}
              label={getLabel(scene)}
              active={focused}
              onPress={() => onItemPress(scene)}
            />
          );
        })}
      </Surface>
    </SafeAreaView>
  </ScrollView>
);

NavigatorDrawerContainer.propTypes = {
  items: Types.arrayOfKeyedShapes.isRequired,
  activeItemKey: Types.string.isRequired,
  getLabel: Types.func.isRequired,
  renderIcon: Types.func.isRequired,
  onItemPress: Types.func.isRequired,
};

export default NavigatorDrawerContainer;
