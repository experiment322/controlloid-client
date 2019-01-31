import React from 'react';
import PropTypes from 'prop-types';
import { Card, HelperText, TextInput } from 'react-native-paper';
import Styles from '../styles';

const PreferenceCard = (props) => {
  const {
    name, value, helperText, onChange, onSave, onValidate,
  } = props;
  return (
    <Card style={Styles.elevate}>
      <Card.Content>
        <TextInput
          mode="outlined"
          autoCorrect={false}
          autoCapitalize="none"
          label={name}
          value={value}
          error={!onValidate(value)}
          onChangeText={onChange}
          onSubmitEditing={onSave}
        />
        <HelperText type="error" visible={!onValidate(value)}>
          {helperText}
        </HelperText>
      </Card.Content>
    </Card>
  );
};

PreferenceCard.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
};

export default PreferenceCard;
