import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList } from 'react-native';
import {
  List, Surface, Text, TextInput, TouchableRipple,
} from 'react-native-paper';
import { LayoutsActions } from '../../redux';
import Styles from '../styles';

class LayoutsScreen extends React.Component {
  static defaultProps = {
    activeLayout: null,
  };

  static propTypes = {
    layouts: PropTypes.objectOf(PropTypes.object.isRequired).isRequired,
    activeLayout: PropTypes.string,
    createLayout: PropTypes.func.isRequired,
    deleteLayout: PropTypes.func.isRequired,
    setActiveLayout: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.layoutInputRef = React.createRef();
  }


  renderListItem = ({ item }) => {
    const { activeLayout, deleteLayout, setActiveLayout } = this.props;
    const itemStatusIcon = activeLayout === item ? 'star' : 'star-border';
    return (
      <List.Item
        title={item}
        onPress={() => null}
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

  extractItemKey = item => item;

  renderListEmptyComponent = () => (
    <Surface style={Styles.screen}>
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
      createLayout(newLayoutName, {});
    }
    this.layoutInputRef.current.clear();
  };

  render() {
    const { layouts } = this.props;
    return (
      <Surface style={Styles.screen}>
        <FlatList
          data={_.keys(layouts)}
          renderItem={this.renderListItem}
          keyExtractor={this.extractItemKey}
          ListEmptyComponent={this.renderListEmptyComponent()}
          contentContainerStyle={Styles.flatListGrowContent}
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
