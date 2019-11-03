import React from "react";
import KeepAwake from "react-native-keep-awake";
import Orientation from "react-native-orientation-locker";
import { connect } from "react-redux";
import { StatusBar } from "react-native";
import Styles from "../styles";
import * as Types from "../../types";
import { Controls } from "../../lib/controller";
import { TouchDispenser } from "../../lib/utils";

class ControllerScreen extends React.Component {
  componentDidMount() {
    KeepAwake.activate();
    StatusBar.setHidden(true);
    Orientation.lockToLandscape();
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    navigation.getParam("socketClose")();
    Orientation.unlockAllOrientations();
    StatusBar.setHidden(false);
    KeepAwake.deactivate();
  }

  render() {
    const {
      layouts,
      activeLayout,
      analogDeadZone,
      analogStickMax,
      controllerTheme,
      navigation,
    } = this.props;
    const { components } = layouts[activeLayout];
    return (
      <TouchDispenser style={Styles.fullScreen}>
        {components.map((component) => {
          const ControllerComponent = Controls[component.type];
          return (
            <ControllerComponent
              {...component.props}
              {...(ControllerComponent === Controls.Analog && {
                analogDeadZone,
                analogStickMax,
              })}
              key={component.id}
              theme={controllerTheme}
              dispatch={navigation.getParam("socketDispatch")}
            />
          );
        })}
      </TouchDispenser>
    );
  }
}

ControllerScreen.propTypes = {
  layouts: Types.objectOfControllerLayouts.isRequired,
  activeLayout: Types.string.isRequired,
  analogDeadZone: Types.number.isRequired,
  analogStickMax: Types.number.isRequired,
  controllerTheme: Types.controllerTheme.isRequired,
  navigation: Types.navigation.isRequired,
};

const mapStateToProps = (state) => ({
  layouts: state.layouts.layouts,
  activeLayout: state.layouts.activeLayout,
  analogDeadZone: state.preferences.analogDeadZone,
  analogStickMax: state.preferences.analogStickMax,
  controllerTheme: state.preferences.controllerTheme,
});

export default connect(mapStateToProps)(ControllerScreen);
