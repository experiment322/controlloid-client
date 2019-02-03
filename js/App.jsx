import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Provider as StoreProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { createAppContainer, createDrawerNavigator, createStackNavigator } from 'react-navigation';
import { configureStore } from './redux';
import {
  ConnectionScreen,
  ControllerScreen,
  EditorScreen,
  HomeScreen,
  PreferencesScreen,
} from './screens';

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
      activeTheme: null,
    };
  }

  componentDidMount() {
    this.unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        const { preferences: { activeTheme } } = store.getState();
        this.setState({ activeTheme });
        if (this.unsubscribe) {
          this.unsubscribe();
        }
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const { activeTheme } = this.state;
    return (
      <StoreProvider store={store}>
        {!!activeTheme && (
          <PaperProvider theme={activeTheme}>
            <AppContainer />
          </PaperProvider>
        )}
      </StoreProvider>
    );
  }
}

// TODO: make separate folder for screens?
// TODO: rename "screens" to "interface" maybe
// TODO: add module aliases
