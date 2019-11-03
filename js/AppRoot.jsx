import React from "react";
import KeepAwake from "react-native-keep-awake";
import Orientation from "react-native-orientation-locker";
import SplashScreen from "react-native-splash-screen";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator } from "react-native-paper";
import { StatusBar, StyleSheet } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { Provider as StoreProvider } from "react-redux";
import AppContainer from "./AppContainer";
import { configureStore } from "./redux";

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
      <PersistGate
        loading={<ActivityIndicator style={StyleSheet.absoluteFillObject} />}
        persistor={persistor}
      >
        <StoreProvider store={store}>
          <AppContainer />
        </StoreProvider>
      </PersistGate>
    );
  }
}

export default gestureHandlerRootHOC(AppRoot);
