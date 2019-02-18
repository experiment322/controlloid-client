import React from 'react';
import Orientation from 'react-native-orientation-locker';
import { connect } from 'react-redux';
import { StatusBar } from 'react-native';
import Styles from '../styles';
import * as Types from '../../types';
import { TouchDispenser } from '../../lib/utils';
import { Analog, Button } from '../../lib/controller';

const CONTROLLER_COMPONENT_MAPPING = {
  analog: Analog,
  button: Button,
};

class ControllerScreen extends React.Component {
  static propTypes = {
    navigation: Types.navigation.isRequired,
    analogStickMax: Types.number.isRequired,
    controllerTheme: Types.controllerTheme.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      components: [
        {
          id: 1,
          type: 'button',
          props: {
            x: 350,
            y: 225,
            size: 75,
            emit: 'SQUARE',
          },
        }, {
          id: 2,
          type: 'button',
          props: {
            x: 425,
            y: 225,
            size: 75,
            emit: 'CROSS',
          },
        }, {
          id: 3,
          type: 'analog',
          props: {
            x: 50,
            y: 200,
            size: 100,
            emitX: 'ANALOG_LX',
            emitY: 'ANALOG_LY',
          },
        },
      ],
    };
  }

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
    const { components } = this.state;
    const { navigation, analogStickMax, controllerTheme } = this.props;
    return (
      <TouchDispenser style={Styles.fullScreen}>
        {components.map((component) => {
          const ControllerComponent = CONTROLLER_COMPONENT_MAPPING[component.type];
          return (
            <ControllerComponent
              {...component.props}
              key={component.id}
              theme={controllerTheme}
              dispatch={navigation.getParam('socketDispatch')}
              analogStickMax={component.type === 'analog' ? analogStickMax : undefined}
            />
          );
        })}
      </TouchDispenser>
    );
  }
}

const mapStateToProps = state => ({
  analogStickMax: state.preferences.analogStickMax,
  controllerTheme: state.preferences.controllerTheme,
});

export default connect(mapStateToProps)(ControllerScreen);
