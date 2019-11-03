import React from "react";
import { connect } from "react-redux";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { Provider as PaperProvider } from "react-native-paper";
import * as Types from "./types";
import { NavigatorDrawerContainer, NavigatorStackHeader } from "./interface/components";
import {
  ConnectionScreen,
  ControllerScreen,
  EditorScreen,
  HomeScreen,
  LayoutsScreen,
  PreferencesScreen,
} from "./interface/screens";

const HomeStackNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation: { toggleDrawer } }) => ({
      header: <NavigatorStackHeader onAction={toggleDrawer} title="Controlloid" />,
    }),
  },
});

const LayoutsStackNavigator = createStackNavigator({
  Layouts: {
    screen: LayoutsScreen,
    navigationOptions: ({ navigation: { toggleDrawer } }) => ({
      header: <NavigatorStackHeader onAction={toggleDrawer} title="Manage layouts" />,
    }),
  },
  Editor: {
    screen: EditorScreen,
    navigationOptions: () => ({
      header: null,
    }),
  },
});

const ConnectionStackNavigator = createStackNavigator({
  Connection: {
    screen: ConnectionScreen,
    navigationOptions: ({ navigation: { toggleDrawer } }) => ({
      header: <NavigatorStackHeader onAction={toggleDrawer} title="Connect and play" />,
    }),
  },
  Controller: {
    screen: ControllerScreen,
    navigationOptions: () => ({
      header: null,
    }),
  },
});

const PreferencesStackNavigator = createStackNavigator({
  Preferences: {
    screen: PreferencesScreen,
    navigationOptions: ({ navigation: { toggleDrawer } }) => ({
      header: <NavigatorStackHeader onAction={toggleDrawer} title="Change preferences" />,
    }),
  },
});

const lockDrawerOnScreen = (screen, { index, routes }) => {
  const { routeName: currentScreen } = routes[index];
  return currentScreen === screen ? "locked-closed" : "unlocked";
};

const AppNavigator = createDrawerNavigator(
  {
    HomeScreenContainer: {
      screen: HomeStackNavigator,
      navigationOptions: () => ({
        title: "Home",
        drawerIcon: "home",
        drawerLockMode: "unlocked",
      }),
    },
    LayoutsScreenContainer: {
      screen: LayoutsStackNavigator,
      navigationOptions: ({ navigation: { state: navigationState } }) => ({
        title: "Layouts",
        drawerIcon: "layers",
        drawerLockMode: lockDrawerOnScreen("Editor", navigationState),
      }),
    },
    ConnectionScreenContainer: {
      screen: ConnectionStackNavigator,
      navigationOptions: ({ navigation: { state: navigationState } }) => ({
        title: "Controller",
        drawerIcon: "gamepad",
        drawerLockMode: lockDrawerOnScreen("Controller", navigationState),
      }),
    },
    PreferencesScreenContainer: {
      screen: PreferencesStackNavigator,
      navigationOptions: () => ({
        title: "Preferences",
        drawerIcon: "settings",
        drawerLockMode: "unlocked",
      }),
    },
  },
  {
    contentComponent: NavigatorDrawerContainer,
  },
);

const AppContainer = createAppContainer(AppNavigator);

class ThemedAppContainer extends React.PureComponent {
  render() {
    const { applicationTheme } = this.props;
    return (
      <PaperProvider theme={applicationTheme}>
        <AppContainer />
      </PaperProvider>
    );
  }
}

ThemedAppContainer.propTypes = {
  applicationTheme: Types.applicationTheme.isRequired,
};

const mapStateToProps = (state) => ({
  applicationTheme: state.preferences.applicationTheme,
});

export default connect(mapStateToProps)(ThemedAppContainer);
