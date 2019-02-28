import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import Orientation from 'react-native-orientation-locker';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatusBar } from 'react-native';
import { Provider as StoreProvider } from 'react-redux';
import { IconButton, Provider as PaperProvider } from 'react-native-paper';
import { createAppContainer, createDrawerNavigator, createStackNavigator } from 'react-navigation';
import { configureStore } from './redux';
import {
  ConnectionScreen,
  ControllerScreen,
  EditorScreen,
  HomeScreen,
  LayoutsScreen,
  PreferencesScreen,
} from './interface/screens';

const lockDrawerOnScreen = (screen, { index, routes }) => {
  const { routeName: currentScreen } = routes[index];
  return currentScreen === screen ? 'locked-closed' : 'unlocked';
};

const HomeStackNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation: { toggleDrawer } }) => ({
      title: 'Controlloid',
      headerLeft: <IconButton icon="menu" color="black" size={24} onPress={toggleDrawer} />,
    }),
  },
});

const LayoutsStackNavigator = createStackNavigator({
  Layouts: {
    screen: LayoutsScreen,
    navigationOptions: ({ navigation: { toggleDrawer } }) => ({
      title: 'Manage layouts',
      headerLeft: <IconButton icon="menu" color="black" size={24} onPress={toggleDrawer} />,
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
      title: 'Connect and play',
      headerLeft: <IconButton icon="menu" color="black" size={24} onPress={toggleDrawer} />,
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
      title: 'Change preferences',
      headerLeft: <IconButton icon="menu" color="black" size={24} onPress={toggleDrawer} />,
    }),
  },
});

const AppNavigator = createDrawerNavigator({
  HomeScreenContainer: {
    screen: HomeStackNavigator,
    navigationOptions: () => ({
      title: 'Home',
      drawerIcon: <MaterialIcon name="home" size={24} />,
      drawerLockMode: 'unlocked',
    }),
  },
  LayoutsScreenContainer: {
    screen: LayoutsStackNavigator,
    navigationOptions: ({ navigation: { state: navigationState } }) => ({
      title: 'Layouts',
      drawerIcon: <MaterialIcon name="layers" size={24} />,
      drawerLockMode: lockDrawerOnScreen('Editor', navigationState),
    }),
  },
  ConnectionScreenContainer: {
    screen: ConnectionStackNavigator,
    navigationOptions: ({ navigation: { state: navigationState } }) => ({
      title: 'Controller',
      drawerIcon: <MaterialIcon name="gamepad" size={24} />,
      drawerLockMode: lockDrawerOnScreen('Controller', navigationState),
    }),
  },
  PreferencesScreenContainer: {
    screen: PreferencesStackNavigator,
    navigationOptions: () => ({
      title: 'Preferences',
      drawerIcon: <MaterialIcon name="settings" size={24} />,
      drawerLockMode: 'unlocked',
    }),
  },
});

const AppContainer = createAppContainer(AppNavigator);

const { store, persistor } = configureStore();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationTheme: null,
    };
  }

  componentDidMount() {
    StatusBar.setHidden(false);
    Orientation.unlockAllOrientations();
    if (!this.trySetApplicationTheme()) {
      this.persistorUnsubscribe = persistor.subscribe(() => {
        if (this.trySetApplicationTheme() && this.persistorUnsubscribe) {
          this.persistorUnsubscribe();
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.persistorUnsubscribe) {
      this.persistorUnsubscribe();
    }
  }

  trySetApplicationTheme = () => {
    if (persistor.getState().bootstrapped) {
      const { preferences: { applicationTheme } } = store.getState();
      this.setState({ applicationTheme });
      return true;
    }
    return false;
  };

  render() {
    const { applicationTheme } = this.state;
    if (applicationTheme) {
      SplashScreen.hide();
    }
    return (
      <StoreProvider store={store}>
        {!!applicationTheme && (
          <PaperProvider theme={applicationTheme}>
            <AppContainer />
          </PaperProvider>
        )}
      </StoreProvider>
    );
  }
}
