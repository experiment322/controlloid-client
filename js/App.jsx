import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import Orientation from 'react-native-orientation-locker';
import { StatusBar } from 'react-native';
import { Provider as StoreProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { createAppContainer, createDrawerNavigator, createStackNavigator } from 'react-navigation';
import { configureStore } from './redux';
import { NavigatorDrawerContainer, NavigatorStackHeader } from './interface/components';
import {
  ConnectionScreen,
  ControllerScreen,
  EditorScreen,
  HomeScreen,
  LayoutsScreen,
  PreferencesScreen,
} from './interface/screens';

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
  return currentScreen === screen ? 'locked-closed' : 'unlocked';
};

const AppNavigator = createDrawerNavigator({
  HomeScreenContainer: {
    screen: HomeStackNavigator,
    navigationOptions: () => ({
      title: 'Home',
      drawerIcon: 'home',
      drawerLockMode: 'unlocked',
    }),
  },
  LayoutsScreenContainer: {
    screen: LayoutsStackNavigator,
    navigationOptions: ({ navigation: { state: navigationState } }) => ({
      title: 'Layouts',
      drawerIcon: 'layers',
      drawerLockMode: lockDrawerOnScreen('Editor', navigationState),
    }),
  },
  ConnectionScreenContainer: {
    screen: ConnectionStackNavigator,
    navigationOptions: ({ navigation: { state: navigationState } }) => ({
      title: 'Controller',
      drawerIcon: 'gamepad',
      drawerLockMode: lockDrawerOnScreen('Controller', navigationState),
    }),
  },
  PreferencesScreenContainer: {
    screen: PreferencesStackNavigator,
    navigationOptions: () => ({
      title: 'Preferences',
      drawerIcon: 'settings',
      drawerLockMode: 'unlocked',
    }),
  },
}, {
  contentComponent: NavigatorDrawerContainer,
});

const AppContainer = createAppContainer(AppNavigator);

const { store } = configureStore();

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      applicationTheme: null,
    };
  }

  componentDidMount() {
    SplashScreen.hide();
    StatusBar.setHidden(false);
    Orientation.unlockAllOrientations();
    this.storeUnsubscribe = store.subscribe(() => {
      const { preferences: { applicationTheme } } = store.getState();
      this.setState({ applicationTheme });
    });
  }

  componentWillUnmount() {
    if (this.storeUnsubscribe) {
      this.storeUnsubscribe();
    }
  }

  render() {
    const { applicationTheme } = this.state;
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
