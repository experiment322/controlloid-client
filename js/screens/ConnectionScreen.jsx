import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { TextDecoder } from 'text-encoding';
import { Button, Surface, TextInput } from 'react-native-paper';

const SOCKET_MIN_LATENCY = 25;

export default class ConnectionScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      eventCodes: null,
      socket: null,
      socketAddress: '',
      isSocketConnected: false,
    };
  }

  componentDidUpdate() {
    const { navigation } = this.props;
    const { eventCodes, isSocketConnected } = this.state;
    if (isSocketConnected && eventCodes) {
      navigation.navigate('Controller', {
        socketClose: this.socketClose,
        socketDispatch: this.socketDispatch,
      });
    } else {
      navigation.navigate('Connection');
    }
  }

  socketClose = () => {
    const { socket } = this.state;
    if (socket) {
      socket.close();
    }
  };

  socketFlush = () => {
    const { socket, eventCodes } = this.state;
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

  setSocketAddress = socketAddress => this.setState({ socketAddress });

  connectToSocket = () => {
    const { socketAddress } = this.state;
    this.setState({ loading: true });
    const socket = Object.assign(new WebSocket(`http://${socketAddress}`), {
      onopen: () => this.setState({
        loading: true,
        isSocketConnected: true,
      }),
      onclose: () => this.setState({
        loading: false,
        isSocketConnected: false,
      }),
      onmessage: message => this.setState({
        loading: false,
        eventCodes: JSON.parse(new TextDecoder('utf8').decode(message.data)),
      }),
    });
    this.setState({ socket });
  };

  render() {
    const { loading, socketAddress } = this.state;
    return (
      <Surface style={{
        flex: 1,
        padding: 16,
        justifyContent: 'center',
      }}
      >
        <TextInput
          mode="flat"
          label="Server address"
          value={socketAddress}
          onChangeText={this.setSocketAddress}
        />
        <Button
          mode="text"
          icon="launch"
          style={{ elevation: 1 }}
          onPress={this.connectToSocket}
          loading={loading}
          disabled={!socketAddress}
        >
          CONNECT
        </Button>
      </Surface>
    );
  }
}
