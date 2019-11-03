import React from 'react';
import KeepAwake from 'react-native-keep-awake';
import Orientation from 'react-native-orientation-locker';
import SplashScreen from 'react-native-splash-screen';
import { StatusBar } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as StoreProvider } from 'react-redux';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import AppContainer from './AppContainer';
import { configureStore } from './redux';

const { store, persistor } = configureStore();

class AppRoot extends React.PureComponent {
  componentDidMount() {
    KeepAwake.deactivate();
    StatusBar.setHidden(false);
    Orientation.unlockAllOrientations();
    setTimeout(SplashScreen.hide);
  }

  render() {
    return (
      <PersistGate loading={null} persistor={persistor}>
        <StoreProvider store={store}>
          <AppContainer />
        </StoreProvider>
      </PersistGate>
    );
  }
}

export default gestureHandlerRootHOC(AppRoot);
