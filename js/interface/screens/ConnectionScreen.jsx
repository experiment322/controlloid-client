import _ from 'lodash';
import React from 'react';
import axios from 'axios';
import isUrl from 'is-url';
import { connect } from 'react-redux';
import { FlatList } from 'react-native';
import { TextDecoder } from 'text-encoding';
import { NetworkInfo } from 'react-native-network-info';
import {
  Button, List, Surface, Text, TextInput,
} from 'react-native-paper';
import Styles from '../styles';
import * as Types from '../../types';

class ConnectionScreen extends React.Component {
  static defaultProps = {
    activeLayout: null,
  };

  static propTypes = {
    activeLayout: Types.string,
    socketMinLatency: Types.number.isRequired,
    navigation: Types.navigation.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      eventCodes: null,
      socket: null,
      socketAddress: '',
      connecting: false,
      isSocketConnected: false,
      discovering: false,
      discoveredServers: [],
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
    this.setState({
      socket: _.assign(new WebSocket(`${socketAddress}`), {
        onopen: () => this.setState({
          connecting: true,
          isSocketConnected: true,
        }),
        onclose: () => this.setState({
          connecting: false,
          isSocketConnected: false,
        }),
        onmessage: message => this.setState({
          connecting: false,
          eventCodes: JSON.parse(new TextDecoder('utf8').decode(message.data)),
        }),
      }),
      connecting: true,
    });
  };

  renderServerListItem = ({ item }) => (
    <List.Item
      title={item}
      onPress={() => this.setState({ socketAddress: item }, this.connectToSocket)}
      left={props => <List.Icon {...props} icon="computer" />}
    />
  );

  renderServerListEmptyComponent = () => {
    const { discovering } = this.state;
    return (
      <Surface style={Styles.centeredContent}>
        <Text style={Styles.centeredText}>
          {discovering ? 'Scanning LAN servers...' : 'Pull to scan for LAN servers'}
        </Text>
      </Surface>
    );
  };

  scanLANServers = () => {
    this.setState({
      discovering: true,
      discoveredServers: [],
    }, async () => {
      const deviceIp = await NetworkInfo.getIPV4Address();
      if (deviceIp) {
        const network = deviceIp.substring(0, deviceIp.lastIndexOf('.'));
        const requests = _.range(1, 255)
          .map(host => axios.head(`http://${network}.${host}:31415`, { timeout: 500 })
            .then(({ config: { url } }) => url)
            .catch(() => null));
        const results = await Promise.all(requests);
        this.setState({ discoveredServers: _.filter(results) });
      }
      this.setState({ discovering: false });
    });
  };

  render() {
    const {
      connecting, socketAddress, discovering, discoveredServers,
    } = this.state;
    const { activeLayout, navigation } = this.props;

    if (!activeLayout) {
      return (
        <Surface style={Styles.screen}>
          <Button
            icon="layers"
            mode="outlined"
            style={Styles.elevate}
            onPress={() => navigation.navigate('Layouts')}
          >
            SELECT LAYOUT
          </Button>
        </Surface>
      );
    }

    return (
      <Surface style={Styles.screen}>
        <FlatList
          data={discoveredServers}
          refreshing={discovering}
          onRefresh={this.scanLANServers}
          renderItem={this.renderServerListItem}
          keyExtractor={_.identity}
          ListEmptyComponent={this.renderServerListEmptyComponent}
          contentContainerStyle={Styles.flexGrowOne}
        />
        <TextInput
          mode="outlined"
          label="Server address"
          autoCorrect={false}
          autoCapitalize="none"
          value={socketAddress}
          error={socketAddress && !isUrl(socketAddress)}
          disabled={connecting}
          onChangeText={this.setSocketAddress}
        />
        <Button
          icon="launch"
          mode="outlined"
          style={Styles.elevate}
          onPress={this.connectToSocket}
          loading={connecting}
          disabled={connecting || !isUrl(socketAddress)}
        >
          CONNECT
        </Button>
      </Surface>
    );
  }
}

const mapStateToProps = state => ({
  activeLayout: state.layouts.activeLayout,
  socketMinLatency: state.preferences.socketMinLatency,
});

export default connect(mapStateToProps)(ConnectionScreen);
