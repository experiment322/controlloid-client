import React from 'react';
import PropTypes from 'prop-types';
import Orientation from 'react-native-orientation-locker';
import { connect } from 'react-redux';
import { StatusBar } from 'react-native';
import { TouchDispenser } from '../../lib/utils';
import { Analog, Button } from '../../lib/controller';
import Styles from '../styles';

const CONTROLLER_COMPONENT_MAPPING = {
  analog: Analog,
  button: Button,
};

class ControllerScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({ getParam: PropTypes.func.isRequired }).isRequired,
    analogStickMax: PropTypes.number.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      components: [
        {
          id: 1,
          type: 'button',
          props: {
            x: 400,
            y: 225,
            size: 75,
            emit: 'BTN_WEST',
            bgColor: 'blue',
            fgColor: 'red',
          },
        }, {
          id: 2,
          type: 'button',
          props: {
            x: 475,
            y: 225,
            size: 75,
            emit: 'BTN_EAST',
            bgColor: 'blue',
            fgColor: 'red',
          },
        }, {
          id: 3,
          type: 'analog',
          props: {
            x: 25,
            y: 200,
            size: 100,
            emitX: 'ABS_X',
            emitY: 'ABS_Y',
            bgColor: 'blue',
            fgColor: 'red',
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
    const { navigation, analogStickMax } = this.props;
    return (
      <TouchDispenser style={Styles.fullScreen}>
        {components.map((component) => {
          const ControllerComponent = CONTROLLER_COMPONENT_MAPPING[component.type];
          return (
            <ControllerComponent
              {...component.props}
              key={component.id}
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
});

export default connect(mapStateToProps)(ControllerScreen);
