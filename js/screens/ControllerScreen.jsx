import React from 'react';
import PropTypes from 'prop-types';
import { TouchDispenser } from '../lib';
import { Analog, Button } from '../controller';

const CONTROLLER_COMPONENT_MAPPING = {
  analog: Analog,
  button: Button,
};

export default class ControllerScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      components: [
        {
          id: 1,
          type: 'button',
          props: {
            x: 25,
            y: 350,
            size: 75,
            emit: 'BTN_WEST',
            bgColor: 'blue',
            fgColor: 'red',
          },
        }, {
          id: 2,
          type: 'button',
          props: {
            x: 25,
            y: 425,
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
            y: 50,
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

  componentWillUnmount() {
    const { navigation } = this.props;
    navigation.getParam('socketClose')();
  }

  render() {
    const { components } = this.state;
    const { navigation } = this.props;
    return (
      <TouchDispenser style={{
        flex: 1,
        backgroundColor: 'black',
      }}
      >
        {components.map((component) => {
          const ControllerComponent = CONTROLLER_COMPONENT_MAPPING[component.type];
          return (
            <ControllerComponent
              {...component.props}
              key={component.id}
              dispatch={navigation.getParam('socketDispatch')}
            />
          );
        })}
      </TouchDispenser>
    );
  }
}
