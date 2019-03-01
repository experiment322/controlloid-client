import React from 'react';
import { HelperText, Surface, TextInput } from 'react-native-paper';
import Styles from '../styles';
import * as Types from '../../types';

export default class PreferenceInputCard extends React.PureComponent {
  static propTypes = {
    name: Types.string.isRequired,
    value: Types.string.isRequired,
    helperText: Types.string.isRequired,
    onValidate: Types.func.isRequired,
    onSubmit: Types.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      text: props.value,
      isTextValid: props.onValidate(props.value),
      mustSyncState: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;
    const { mustSyncState } = this.state;
    if (value !== prevProps.value || mustSyncState) {
      this.syncWithProps();
    }
  }

  requireStateSync = () => {
    this.setState({ mustSyncState: true });
  };

  syncWithProps = () => {
    const { value, onValidate } = this.props;
    this.setState({
      text: value,
      isTextValid: onValidate(value),
      mustSyncState: false,
    });
  };

  setText = (text) => {
    const { onValidate } = this.props;
    this.setState({
      text,
      isTextValid: onValidate(text),
    });
  };

  submitText = () => {
    const { onSubmit } = this.props;
    const { text, isTextValid } = this.state;
    if (isTextValid) {
      onSubmit(text);
    }
    this.requireStateSync();
  };

  render() {
    const { name, helperText } = this.props;
    const { text, isTextValid } = this.state;
    return (
      <Surface style={Styles.preferenceCard}>
        <TextInput
          mode="outlined"
          label={name}
          value={text}
          error={!isTextValid}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={this.setText}
          onSubmitEditing={this.submitText}
        />
        <HelperText type="info">
          {helperText}
        </HelperText>
      </Surface>
    );
  }
}
