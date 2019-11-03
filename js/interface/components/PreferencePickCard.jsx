import React from "react";
import { ScrollView, TextInput as NativeTextInput } from "react-native";
import {
  HelperText,
  List,
  Modal,
  Portal,
  Surface,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import Styles from "../styles";
import * as Types from "../../types";

export default class PreferencePickCard extends React.PureComponent {
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
      const optionStatusIcon = option.name === value.name ? "radiobox-marked" : "radiobox-blank";
      return (
        <List.Item
          key={option.name}
          title={option.name}
          right={(props) => <List.Icon {...props} icon={optionStatusIcon} />}
          onPress={() => this.pickOption(option)}
        />
      );
    });
  };

  render() {
    const { name, value, helperText } = this.props;
    const { picking } = this.state;
    return (
      <Surface style={Styles.preferenceCard}>
        <TextInput
          mode="outlined"
          label={name}
          value={value.name}
          render={(props) => (
            <TouchableRipple onPress={this.startPicking}>
              <NativeTextInput {...props} editable={false} />
            </TouchableRipple>
          )}
        />
        <HelperText type="info">{helperText}</HelperText>
        <Portal>
          <Modal visible={picking} onDismiss={this.stopPicking}>
            <Surface style={Styles.pickerModal}>
              <ScrollView overScrollMode="never">{this.renderOptions()}</ScrollView>
            </Surface>
          </Modal>
        </Portal>
      </Surface>
    );
  }
}

PreferencePickCard.propTypes = {
  name: Types.string.isRequired,
  value: Types.namedShape.isRequired,
  options: Types.arrayOfNamedShapes.isRequired,
  helperText: Types.string.isRequired,
  onPick: Types.func.isRequired,
};
