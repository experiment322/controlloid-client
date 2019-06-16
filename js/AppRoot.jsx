import React from 'react';
import KeepAwake from 'react-native-keep-awake';
import Orientation from 'react-native-orientation-locker';
import SplashScreen from 'react-native-splash-screen';
import { StatusBar } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as StoreProvider } from 'react-redux';
import AppContainer from './AppContainer';
import { configureStore } from './redux';

const { store, persistor } = configureStore();

export default class AppRoot extends React.PureComponent {
  componentDidMount() {
    KeepAwake.deactivate();
    StatusBar.setHidden(false);
    Orientation.unlockAllOrientations();
    setTimeout(() => SplashScreen.hide(), 333);
  }

  render() {
    return (
      <PersistGate persistor={persistor}>
        <StoreProvider store={store}>
          <AppContainer />
        </StoreProvider>
      </PersistGate>
    );
  }
}
