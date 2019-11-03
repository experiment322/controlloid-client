import _ from "lodash";
import React from "react";
import KeepAwake from "react-native-keep-awake";
import Orientation from "react-native-orientation-locker";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { State, TapGestureHandler } from "react-native-gesture-handler";
import { List, Modal, Portal, Surface } from "react-native-paper";
import { Dimensions, ScrollView, StatusBar, View } from "react-native";
import Styles from "../styles";
import * as Types from "../../types";
import { Components } from "../../lib/controller";
import { LayoutsActions } from "../../redux";
import { ComponentEditorBox } from "../components";

const MINIMUM_SIZE = 50;
const MAXIMUM_SIZE = 150;
const DEFAULT_CONTROL_SIZE = {
  Analog: 100,
  Button: 75,
};

function clampComponent(component) {
  const {
    props: { x, y, size },
  } = component;
  const { width, height } = Dimensions.get("window");
  const clampedSize = Math.min(Math.max(size, MINIMUM_SIZE), MAXIMUM_SIZE);
  const clampedX = Math.min(Math.max(x, 0), width - clampedSize);
  const clampedY = Math.min(Math.max(y, 0), height - clampedSize);
  return {
    ...component,
    props: {
      ...component.props,
      size: clampedSize,
      x: clampedX,
      y: clampedY,
    },
  };
}

class EditorScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: null,
      picking: false,
      activeComponentId: null,
    };
  }

  componentDidMount() {
    const { layouts, navigation } = this.props;
    KeepAwake.activate();
    StatusBar.setHidden(true);
    Orientation.lockToLandscape();
    this.setState({ layout: _.cloneDeep(layouts[navigation.getParam("editedLayout")]) });
  }

  componentWillUnmount() {
    const { layout } = this.state;
    const { createLayout, navigation } = this.props;
    createLayout(navigation.getParam("editedLayout"), layout);
    Orientation.unlockAllOrientations();
    StatusBar.setHidden(false);
    KeepAwake.deactivate();
  }

  openComponentPicker = () => {
    this.setState({ picking: true });
  };

  closeComponentPicker = () => {
    this.setState({ picking: false });
  };

  handleScreenTap = ({ nativeEvent: { oldState } }) => {
    if (oldState === State.ACTIVE) {
      this.setState({ activeComponentId: null }, () => {
        this.openComponentPicker();
      });
    }
  };

  updateComponent = (component, updatedComponent, markActive) => {
    const { layout } = this.state;
    const components = _.without(layout.components, component);
    this.setState({
      activeComponentId: updatedComponent && markActive ? updatedComponent.id : null,
      layout: {
        ...layout,
        components: updatedComponent
          ? [...components, clampComponent(updatedComponent)]
          : components,
      },
    });
  };

  addComponent = (data) => {
    const { width, height } = Dimensions.get("window");
    const componentSize = _.defaultTo(DEFAULT_CONTROL_SIZE[data.type], MINIMUM_SIZE);
    const component = {
      id: _.now(),
      type: data.type,
      props: {
        ...data.props,
        x: width / 2 - componentSize / 2,
        y: height / 2 - componentSize / 2,
        size: componentSize,
      },
    };
    this.updateComponent(null, component, false);
    this.closeComponentPicker();
  };

  renderComponents = () =>
    Components.map((component) => (
      <List.Item
        key={component.name}
        title={component.name}
        left={(props) => <MaterialIcon {...props} size={48} name={component.props.stickerIcon} />}
        onPress={() => this.addComponent(component)}
      />
    ));

  render() {
    const { layout, picking, activeComponentId } = this.state;
    const { controllerTheme } = this.props;
    return (
      <>
        <View style={Styles.fullScreen}>
          <TapGestureHandler onHandlerStateChange={this.handleScreenTap}>
            <View style={[Styles.absoluteFill, Styles.centeredContent]}>
              <MaterialIcon name="gesture-tap" color="white" size={64} />
            </View>
          </TapGestureHandler>
          {layout &&
            layout.components.map((component) => (
              <ComponentEditorBox
                key={component.id}
                theme={controllerTheme}
                focused={activeComponentId === component.id}
                component={component}
                onUpdate={this.updateComponent}
              />
            ))}
        </View>
        <Portal>
          <Modal visible={picking} onDismiss={this.closeComponentPicker}>
            <Surface style={Styles.pickerModal}>
              <ScrollView overScrollMode="never">{this.renderComponents()}</ScrollView>
            </Surface>
          </Modal>
        </Portal>
      </>
    );
  }
}

EditorScreen.propTypes = {
  layouts: Types.objectOfControllerLayouts.isRequired,
  createLayout: Types.func.isRequired,
  controllerTheme: Types.controllerTheme.isRequired,
  navigation: Types.navigation.isRequired,
};

const mapStateToProps = (state) => ({
  layouts: state.layouts.layouts,
  controllerTheme: state.preferences.controllerTheme,
});

const mapDispatchToProps = {
  createLayout: LayoutsActions.createLayout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditorScreen);
