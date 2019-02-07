import _ from 'lodash';
import React from 'react';
import isUrl from 'is-url';
import { connect } from 'react-redux';
import { TextDecoder } from 'text-encoding';
import { Button, Surface, TextInput } from 'react-native-paper';
import Styles from '../styles';
import * as Types from '../../types';

class ConnectionScreen extends React.Component {
  static propTypes = {
    navigation: Types.navigation.isRequired,
    socketMinLatency: Types.number.isRequired,
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

  componentDidUpdate(prevProps, prevState) {
    const { navigation } = this.props;
    const { eventCodes, isSocketConnected } = this.state;
    if (isSocketConnected && eventCodes) {
      navigation.navigate('Controller', {
        socketClose: this.socketClose,
        socketDispatch: this.socketDispatch,
      });
    } else if (prevState.isSocketConnected && !isSocketConnected) {
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
    const { socketMinLatency } = this.props;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.dispatchQueue = _.assign(socket.dispatchQueue, data);
      if (isCritical) {
        this.socketFlush();
      } else if (!socket.dispatchTimeout) {
        socket.dispatchTimeout = setTimeout(this.socketFlush, socketMinLatency);
      }
    }
  };

  setSocketAddress = socketAddress => this.setState({ socketAddress });

  connectToSocket = () => {
    const { socketAddress } = this.state;
    this.setState({ loading: true });
    const socket = Object.assign(new WebSocket(`${socketAddress}`), {
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
      <Surface style={Styles.screen}>
        <TextInput
          mode="outlined"
          label="Server address"
          autoCorrect={false}
          autoCapitalize="none"
          value={socketAddress}
          error={socketAddress && !isUrl(socketAddress)}
          disabled={loading}
          onChangeText={this.setSocketAddress}
        />
        <Button
          icon="launch"
          mode="outlined"
          style={Styles.elevate}
          onPress={this.connectToSocket}
          loading={loading}
          disabled={loading || !socketAddress || !isUrl(socketAddress)}
        >
          CONNECT
        </Button>
      </Surface>
    );
  }
}

const mapStateToProps = state => ({
  socketMinLatency: state.preferences.socketMinLatency,
});

export default connect(mapStateToProps)(ConnectionScreen);
