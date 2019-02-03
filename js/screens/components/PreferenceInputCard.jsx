import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, HelperText, TextInput, withTheme,
} from 'react-native-paper';
import Styles from '../styles';

class PreferenceInputCard extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    helperText: PropTypes.string.isRequired,
    onValidate: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    theme: PropTypes.shape({ colors: PropTypes.object.isRequired }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      text: props.value,
      isTextValid: props.onValidate(props.value),
    };
  }

  syncWithProps = () => {
    const { value, onValidate } = this.props;
    this.setState({
      text: value,
      isTextValid: onValidate(value),
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
    this.syncWithProps();
  };

  render() {
    const { name, helperText, theme } = this.props;
    const { text, isTextValid } = this.state;
    return (
      <Card style={[Styles.preferenceCard, Styles.elevate, {
        borderColor: theme.colors.text,
      }]}
      >
        <Card.Content>
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
          <HelperText type="error" visible={!isTextValid}>
            {helperText}
          </HelperText>
        </Card.Content>
      </Card>
    );
  }
}

export default withTheme(PreferenceInputCard);
