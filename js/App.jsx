import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as StoreProvider } from 'react-redux';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { createAppContainer, createDrawerNavigator, createStackNavigator } from 'react-navigation';
import {
  ConnectionScreen,
  ControllerScreen,
  EditorScreen,
  HomeScreen,
  PreferencesScreen,
} from './screens';
import { configureStore } from './redux';

const lockDrawerOnController = ({ routeName }) => (
  routeName === 'Controller' ? 'locked-closed' : 'unlocked'
);

const AppNavigator = createDrawerNavigator({
  HomeScreenContainer: {
    screen: createStackNavigator({
      Home: {
        screen: HomeScreen,
        navigationOptions: {
          title: 'Controlloid',
        },
      },
    }),
    navigationOptions: {
      title: 'Home',
      drawerIcon: <MaterialIcon name="home" size={24} />,
    },
  },
  EditorScreenContainer: {
    screen: createStackNavigator({
      Editor: {
        screen: EditorScreen,
        navigationOptions: {
          title: 'Edit layouts',
        },
      },
    }),
    navigationOptions: {
      title: 'Editor',
      drawerIcon: <MaterialIcon name="edit" size={24} />,
    },
  },
  ConnectionScreenContainer: {
    screen: createStackNavigator({
      Connection: {
        screen: ConnectionScreen,
        navigationOptions: {
          title: 'Connect and play',
        },
      },
      Controller: {
        screen: ControllerScreen,
        navigationOptions: {
          header: null,
        },
      },
    }),
    navigationOptions: ({ navigation: { state: { index, routes } } }) => ({
      title: 'Connect',
      drawerIcon: <MaterialIcon name="link" size={24} />,
      drawerLockMode: lockDrawerOnController(routes[index]),
    }),
  },
  PreferencesScreenContainer: {
    screen: createStackNavigator({
      Preferences: {
        screen: PreferencesScreen,
        navigationOptions: {
          title: 'Change preferences',
        },
      },
    }),
    navigationOptions: {
      title: 'Preferences',
      drawerIcon: <MaterialIcon name="settings" size={24} />,
    },
  },
});

const AppContainer = createAppContainer(AppNavigator);

const { store, persistor } = configureStore();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: DarkTheme,
    };
  }

  render() {
    const { theme } = this.state;
    return (
      <StoreProvider store={store}>
        <PersistGate persistor={persistor}>
          <PaperProvider theme={theme}>
            <AppContainer />
          </PaperProvider>
        </PersistGate>
      </StoreProvider>
    );
  }
}
