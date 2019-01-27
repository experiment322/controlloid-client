import _ from 'lodash';
import React from 'react';
import { Alert } from 'react-native';
import { TextDecoder } from 'text-encoding';
import { Analog, Button } from './gamepad';
import { TouchDispenser } from './input';

const SOCKET_MIN_LATENCY = 25;

const GAMEPAD_COMPONENT_MAPPING = {
  analog: Analog,
  button: Button,
};

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      socket: null,
      eventCodes: {},
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

  componentDidMount() {
    const socket = Object.assign(new WebSocket('ws://localhost:1337'), {
      onopen: () => Alert.alert('info', 'connected'),
      onerror: error => Alert.alert('error', error.message),
      onclose: status => Alert.alert('closed', status.message),
      onmessage: message => this.setState({ eventCodes: JSON.parse(new TextDecoder('utf8').decode(message.data)) }),
    });
    this.setState({ socket });
  }

  componentWillUnmount() {
    const { socket } = this.state;
    socket.close();
  }

  socketFlush = () => {
    const { eventCodes, socket } = this.state;
    const eventData = _.flatMap(socket.dispatchQueue, (value, name) => [eventCodes[name], value]);
    socket.send(new Int16Array(eventData));
    clearTimeout(socket.dispatchTimeout);
    socket.dispatchTimeout = null;
    socket.dispatchQueue = null;
  };

  socketDispatch = (data, isCritical) => {
    const { socket } = this.state;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.dispatchQueue = _.assign(socket.dispatchQueue, data);
      if (isCritical) {
        this.socketFlush();
      } else if (!socket.dispatchTimeout) {
        socket.dispatchTimeout = setTimeout(this.socketFlush, SOCKET_MIN_LATENCY);
      }
    }
  };

  render() {
    const { components } = this.state;
    return (
      <TouchDispenser style={{
        flex: 1,
        backgroundColor: 'white',
      }}
      >
        {components.map((component) => {
          const GamepadComponent = GAMEPAD_COMPONENT_MAPPING[component.type];
          return (
            <GamepadComponent
              {...component.props}
              key={component.id}
              dispatch={this.socketDispatch}
            />
          );
        })}
      </TouchDispenser>
    );
  }
}
