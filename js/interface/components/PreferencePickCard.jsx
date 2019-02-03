import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, TextInput as NativeTextInput } from 'react-native';
import {
  Card,
  HelperText,
  IconButton,
  List,
  Modal,
  Portal,
  Surface,
  TextInput,
  TouchableRipple,
  withTheme,
} from 'react-native-paper';
import Styles from '../styles';

class PreferencePickCard extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    helperText: PropTypes.string.isRequired,
    onPick: PropTypes.func.isRequired,
    theme: PropTypes.shape({ colors: PropTypes.object.isRequired }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      picking: false,
    };
  }

  startPicking = () => this.setState({ picking: true });

  stopPicking = () => this.setState({ picking: false });

  pickOption = (option) => {
    const { value, onPick } = this.props;
    if (option.name !== value.name) {
      onPick(option);
    }
    this.stopPicking();
  };

  renderOptions = () => {
    const { value, options } = this.props;
    return options.map((option) => {
      const optionStatusIcon = option.name === value.name
        ? 'radio-button-checked'
        : 'radio-button-unchecked';
      return (
        <List.Item
          key={option.name}
          title={option.name}
          right={props => <List.Icon {...props} icon={optionStatusIcon} />}
          onPress={() => this.pickOption(option)}
        />
      );
    });
  };

  render() {
    const {
      name, value, helperText, theme,
    } = this.props;
    const { picking } = this.state;
    return (
      <Card style={[Styles.preferenceCard, Styles.elevate, {
        borderColor: theme.colors.text,
      }]}
      >
        <Card.Content>
          <Portal>
            <Modal
              visible={picking}
              onDismiss={this.stopPicking}
              contentContainerStyle={[Styles.pickerModal, {
                backgroundColor: theme.colors.background,
              }]}
            >
              <ScrollView>
                {this.renderOptions()}
              </ScrollView>
            </Modal>
          </Portal>
          <Surface>
            <TouchableRipple onPress={this.startPicking}>
              <TextInput
                mode="outlined"
                label={name}
                value={value.name}
                render={props => <NativeTextInput {...props} editable={false} />}
              />
            </TouchableRipple>
            <Surface style={Styles.pullRight} pointerEvents="none">
              <IconButton style={Styles.pickerArrow} icon="arrow-drop-down-circle" />
            </Surface>
          </Surface>
          <HelperText type="info">
            {helperText}
          </HelperText>
        </Card.Content>
      </Card>
    );
  }
}

export default withTheme(PreferencePickCard);
