import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Button, Surface } from 'react-native-paper';
import { Alert, ScrollView } from 'react-native';
import Styles from '../styles';
import * as Types from '../../types';
import * as ApplicationThemes from '../themes';
import { PreferencesActions } from '../../redux';
import { PreferenceInputCard, PreferencePickCard } from '../components';

class PreferencesScreen extends React.Component {
  static propTypes = {
    applicationTheme: Types.applicationTheme.isRequired,
    analogStickMax: Types.number.isRequired,
    socketMinLatency: Types.number.isRequired,
    saveApplicationTheme: Types.func.isRequired,
    saveAnalogStickMax: Types.func.isRequired,
    saveSocketMinLatency: Types.func.isRequired,
    resetPreferences: Types.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      preferencesKey: Date.now(),
    };
  }

  validateAnalogStickMax = value => /^\d+$/.test(value)
    && Number(value) >= 1 && Number(value) <= 32767;

  validateSocketMinLatency = value => /^\d+$/.test(value)
    && Number(value) >= 0 && Number(value) <= 1000;

  confirmResetPreferences = () => {
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
          this.setState({ preferencesKey: Date.now() });
        },
      }], { cancelable: false },
    );
  };

  render() {
    const {
      applicationTheme, analogStickMax, socketMinLatency,
      saveApplicationTheme, saveAnalogStickMax, saveSocketMinLatency,
    } = this.props;
    const { preferencesKey } = this.state;
    return (
      <Surface style={Styles.screen}>
        <ScrollView key={preferencesKey}>
          <PreferencePickCard
            name="Application theme"
            helperText="Restart application to apply theme"
            value={applicationTheme}
            options={_.values(ApplicationThemes)}
            onPick={value => saveApplicationTheme(value)}
          />
          <PreferenceInputCard
            name="Analog stick range"
            helperText="Valid values: 1 - 32767 (px)"
            value={String(analogStickMax)}
            onValidate={this.validateAnalogStickMax}
            onSubmit={value => saveAnalogStickMax(Number(value))}
          />
          <PreferenceInputCard
            name="Socket minimum latency"
            helperText="Valid values: 0 - 1000 (ms)"
            value={String(socketMinLatency)}
            onValidate={this.validateSocketMinLatency}
            onSubmit={value => saveSocketMinLatency(Number(value))}
          />
        </ScrollView>
        <Button
          mode="contained"
          color="crimson"
          style={Styles.elevate}
          onPress={this.confirmResetPreferences}
        >
          RESET
        </Button>
      </Surface>
    );
  }
}

const mapStateToProps = state => ({
  applicationTheme: state.preferences.applicationTheme,
  analogStickMax: state.preferences.analogStickMax,
  socketMinLatency: state.preferences.socketMinLatency,
});

const mapDispatchToProps = {
  saveApplicationTheme: PreferencesActions.setApplicationTheme,
  saveAnalogStickMax: PreferencesActions.setAnalogStickMax,
  saveSocketMinLatency: PreferencesActions.setSocketMinLatency,
  resetPreferences: PreferencesActions.setDefaults,
};

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesScreen);
