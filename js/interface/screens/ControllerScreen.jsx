import React from 'react';
import Orientation from 'react-native-orientation-locker';
import { connect } from 'react-redux';
import { StatusBar } from 'react-native';
import Styles from '../styles';
import * as Types from '../../types';
import { Controls } from '../../lib/controller';
import { TouchDispenser } from '../../lib/utils';

class ControllerScreen extends React.Component {
  static propTypes = {
    layouts: Types.objectOfControllerLayouts.isRequired,
    activeLayout: Types.string.isRequired,
    analogStickMax: Types.number.isRequired,
    controllerTheme: Types.controllerTheme.isRequired,
    navigation: Types.navigation.isRequired,
  };

  componentDidMount() {
    StatusBar.setHidden(true);
    Orientation.lockToLandscape();
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    navigation.getParam('socketClose')();
    Orientation.unlockAllOrientations();
    StatusBar.setHidden(false);
  }

  render() {
    const {
      layouts, activeLayout, analogStickMax, controllerTheme, navigation,
    } = this.props;
    const { components } = layouts[activeLayout];
    return (
      <TouchDispenser style={Styles.fullScreen}>
        {components.map((component) => {
          const ControllerComponent = Controls[component.type];
          return (
            <ControllerComponent
              {...component.props}
              {...(ControllerComponent === Controls.Analog && { analogStickMax })}
              key={component.id}
              theme={controllerTheme}
              dispatch={navigation.getParam('socketDispatch')}
            />
          );
        })}
      </TouchDispenser>
    );
  }
}

const mapStateToProps = state => ({
  layouts: state.layouts.layouts,
  activeLayout: state.layouts.activeLayout,
  analogStickMax: state.preferences.analogStickMax,
  controllerTheme: state.preferences.controllerTheme,
});

export default connect(mapStateToProps)(ControllerScreen);
