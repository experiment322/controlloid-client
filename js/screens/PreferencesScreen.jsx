import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Surface } from 'react-native-paper';
import { Alert, ScrollView } from 'react-native';
import { PreferenceCard } from './components';
import { PreferencesActions } from '../redux';
import Styles from './styles';

class PreferencesScreen extends React.Component {
  static propTypes = {
    analogStickMax: PropTypes.number.isRequired,
    socketMinLatency: PropTypes.number.isRequired,
    resetPreferences: PropTypes.func.isRequired,
    saveAnalogStickMax: PropTypes.func.isRequired,
    saveSocketMinLatency: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      analogStickMax: props.analogStickMax,
      socketMinLatency: props.socketMinLatency,
    };
  }

  syncWithProps = () => {
    const { analogStickMax, socketMinLatency } = this.props;
    this.setState({
      analogStickMax,
      socketMinLatency,
    });
  };

  setAnalogStickMax = value => this.setState({ analogStickMax: value });

  validateAnalogStickMax = value => /^\d+$/.test(value)
    && Number(value) >= 1 && Number(value) <= 32767;

  saveAnalogStickMax = () => {
    const { analogStickMax } = this.state;
    if (this.validateAnalogStickMax(analogStickMax)) {
      const { saveAnalogStickMax } = this.props;
      saveAnalogStickMax(Number(analogStickMax));
    }
  };

  setSocketMinLatency = value => this.setState({ socketMinLatency: value });

  validateSocketMinLatency = value => /^\d+$/.test(value)
    && Number(value) >= 0 && Number(value) <= 1000;

  saveSocketMinLatency = () => {
    const { socketMinLatency } = this.state;
    if (this.validateSocketMinLatency(socketMinLatency)) {
      const { saveSocketMinLatency } = this.props;
      saveSocketMinLatency(Number(socketMinLatency));
    }
  };

  resetPreferences = () => {
    const { resetPreferences } = this.props;
    Alert.alert(
      'Reset preferences',
      'Are you sure?',
      [{
        text: 'CANCEL',
        style: 'cancel',
      }, {
        text: 'CONFIRM',
        onPress: () => {
          resetPreferences();
          this.syncWithProps();
        },
      }], { cancelable: false },
    );
  };

  render() {
    const { analogStickMax, socketMinLatency } = this.state;
    return (
      <Surface style={Styles.screen}>
        <ScrollView>
          <PreferenceCard
            name="Analog stick range"
            helperText="Valid values: 1 - 32767 (px)"
            value={String(analogStickMax)}
            onSave={this.saveAnalogStickMax}
            onChange={this.setAnalogStickMax}
            onValidate={this.validateAnalogStickMax}
          />
          <PreferenceCard
            name="Socket minimum latency"
            helperText="Valid values: 0 - 1000 (ms)"
            value={String(socketMinLatency)}
            onSave={this.saveSocketMinLatency}
            onChange={this.setSocketMinLatency}
            onValidate={this.validateSocketMinLatency}
          />
        </ScrollView>
        <Button
          mode="contained"
          color="crimson"
          style={Styles.elevate}
          onPress={this.resetPreferences}
        >
          RESET
        </Button>
      </Surface>
    );
  }
}

const mapStateToProps = state => ({
  analogStickMax: state.preferences.analogStickMax,
  socketMinLatency: state.preferences.socketMinLatency,
});

const mapDispatchToProps = {
  resetPreferences: PreferencesActions.setDefaults,
  saveAnalogStickMax: PreferencesActions.setAnalogStickMax,
  saveSocketMinLatency: PreferencesActions.setSocketMinLatency,
};

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesScreen);
