import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { FlatList } from 'react-native';
import {
  List, Surface, Text, TextInput, TouchableRipple,
} from 'react-native-paper';
import Styles from '../styles';
import * as Types from '../../types';
import { LayoutsActions } from '../../redux';

class LayoutsScreen extends React.Component {
  static defaultProps = {
    activeLayout: null,
  };

  static propTypes = {
    layouts: Types.objectOfControllerLayouts.isRequired,
    activeLayout: Types.string,
    createLayout: Types.func.isRequired,
    deleteLayout: Types.func.isRequired,
    setActiveLayout: Types.func.isRequired,
    navigation: Types.navigation.isRequired,
  };

  constructor(props) {
    super(props);
    this.layoutInputRef = React.createRef();
  }

  renderLayoutListItem = ({ item }) => {
    const {
      activeLayout, deleteLayout, setActiveLayout, navigation,
    } = this.props;
    const itemStatusIcon = activeLayout === item ? 'star' : 'star-border';
    return (
      <List.Item
        title={item}
        onPress={() => navigation.navigate('Editor', { editedLayout: item })}
        left={props => (
          <TouchableRipple onPress={() => setActiveLayout(item)}>
            <List.Icon {...props} icon={itemStatusIcon} />
          </TouchableRipple>
        )}
        right={props => (
          <TouchableRipple onPress={() => deleteLayout(item)}>
            <List.Icon {...props} icon="delete" />
          </TouchableRipple>
        )}
      />
    );
  };

  renderLayoutListEmptyComponent = () => (
    <Surface style={Styles.centeredContent}>
      <Text style={Styles.centeredText}>
        Use the input below to create new layouts
      </Text>
    </Surface>
  );

  createLayout = ({ nativeEvent: { text } }) => {
    const { layouts, createLayout } = this.props;
    const newLayoutName = text
      .trim()
      .slice(0, 256);
    if (newLayoutName && !_.has(layouts, newLayoutName)) {
      createLayout(newLayoutName, {
        name: newLayoutName,
        components: [],
      });
    }
    this.layoutInputRef.current.clear();
  };

  render() {
    const { layouts } = this.props;
    return (
      <Surface style={Styles.screen}>
        <FlatList
          data={_.sortBy(_.keys(layouts))}
          renderItem={this.renderLayoutListItem}
          keyExtractor={_.identity}
          ListEmptyComponent={this.renderLayoutListEmptyComponent}
          contentContainerStyle={Styles.flexGrowOne}
        />
        <TextInput
          ref={this.layoutInputRef}
          mode="flat"
          style={Styles.elevate}
          placeholder="New layout"
          onSubmitEditing={this.createLayout}
        />
      </Surface>
    );
  }
}

const mapStateToProps = state => ({
  layouts: state.layouts.layouts,
  activeLayout: state.layouts.activeLayout,
});

const mapDispatchToProps = {
  createLayout: LayoutsActions.createLayout,
  deleteLayout: LayoutsActions.deleteLayout,
  setActiveLayout: LayoutsActions.setActiveLayout,
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutsScreen);
