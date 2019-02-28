import _ from 'lodash';
import React from 'react';
import Orientation from 'react-native-orientation-locker';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import {
  List, Modal, Portal, Surface,
} from 'react-native-paper';
import {
  Animated, Dimensions, ScrollView, StatusBar, View,
} from 'react-native';
import Styles from '../styles';
import * as Types from '../../types';
import { LayoutsActions } from '../../redux';
import { GestureHandler } from '../../lib/utils';
import { Components, Controls } from '../../lib/controller';

const MINIMUM_SIZE = 50;
const DEFAULT_CONTROL_SIZE = {
  Analog: 100,
  Button: 75,
};

class EditorScreen extends React.Component {
  static propTypes = {
    layouts: Types.objectOfControllerLayouts.isRequired,
    createLayout: Types.func.isRequired,
    controllerTheme: Types.controllerTheme.isRequired,
    navigation: Types.navigation.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      layout: null,
      picking: false,
      activeComponentId: null,
    };

    this.scale = new Animated.Value(1);
    this.animatePinch = Animated.event([{
      nativeEvent: {
        scale: this.scale,
      },
    }]);

    this.translation = new Animated.ValueXY();
    this.animatePan = Animated.event([{
      nativeEvent: {
        translationX: this.translation.x,
        translationY: this.translation.y,
      },
    }]);
  }

  componentDidMount() {
    const { layouts, navigation } = this.props;
    StatusBar.setHidden(true);
    Orientation.lockToLandscape();
    this.setState({ layout: _.cloneDeep(layouts[navigation.getParam('editedLayout')]) });
  }

  componentWillUnmount() {
    const { layout } = this.state;
    const { createLayout, navigation } = this.props;
    createLayout(navigation.getParam('editedLayout'), layout);
    Orientation.unlockAllOrientations();
    StatusBar.setHidden(false);
  }

  openComponentPicker = () => {
    this.setState({ picking: true });
  };

  closeComponentPicker = () => {
    this.setState({ picking: false });
  };

  handleScreenTap = ({ nativeEvent: { state } }) => {
    if (state === State.ACTIVE) {
      this.openComponentPicker();
    }
  };

  updateComponent = (component, updatedComponent, markActive) => {
    const { layout } = this.state;
    const components = _.without(layout.components, component);
    this.setState({
      activeComponentId: updatedComponent && markActive ? updatedComponent.id : null,
      layout: {
        ...layout,
        components: updatedComponent ? [...components, updatedComponent] : components,
      },
    });
  };

  addComponent = (data) => {
    const { width, height } = Dimensions.get('window');
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

  renderComponents = () => Components.map(component => (
    <List.Item
      key={component.name}
      title={component.name}
      left={props => <MaterialIcon {...props} size={48} name={component.props.stickerIcon} />}
      onPress={() => this.addComponent(component)}
    />
  ));

  handleGestureBegin = (component) => {
    this.scale.resetAnimation();
    this.translation.resetAnimation();
    this.updateComponent(component, component, true);
  };

  handleGestureTerminate = (component) => {
    const deltaSize = component.props.size * this.scale._value - component.props.size; // eslint-disable-line max-len, no-underscore-dangle
    const deltaTranslationX = this.translation.x._value - deltaSize / 2; // eslint-disable-line max-len, no-underscore-dangle
    const deltaTranslationY = this.translation.y._value - deltaSize / 2; // eslint-disable-line max-len, no-underscore-dangle

    const updatedComponent = _.cloneDeep(component);
    updatedComponent.props.x += deltaTranslationX;
    updatedComponent.props.y += deltaTranslationY;
    updatedComponent.props.size += deltaSize;

    const { x, y, size } = updatedComponent.props;
    const { width, height } = Dimensions.get('window');
    updatedComponent.props.x = Math.min(Math.max(x, 0), width - size);
    updatedComponent.props.y = Math.min(Math.max(y, 0), height - size);

    const shouldDelete = updatedComponent.props.size < MINIMUM_SIZE;
    this.updateComponent(component, shouldDelete ? null : updatedComponent, false);
  };

  render() {
    const { layout, picking, activeComponentId } = this.state;
    const { controllerTheme } = this.props;
    return (
      <TapGestureHandler enabled={!activeComponentId} onHandlerStateChange={this.handleScreenTap}>
        <View style={Styles.fullScreen}>
          {layout && !layout.components.length && (
            <View style={Styles.centeredContent}>
              <MaterialIcon name="gesture-tap" color="white" size={64} />
            </View>
          )}
          {layout && layout.components.map((component) => {
            const ControllerComponent = Controls[component.type];
            return (
              <GestureHandler
                key={component.id}
                enabled={!activeComponentId || component.id === activeComponentId}
                onPanEvent={this.animatePan}
                onPinchEvent={this.animatePinch}
                onGestureBegin={() => this.handleGestureBegin(component)}
                onGestureTerminate={() => this.handleGestureTerminate(component)}
              >
                <ControllerComponent
                  {...component.props}
                  {...(activeComponentId === component.id && {
                    opacity: Animated.multiply(component.props.size, this.scale)
                      .interpolate({
                        inputRange: [-Infinity, MINIMUM_SIZE, MINIMUM_SIZE, Infinity],
                        outputRange: [0.5, 0.5, 1, 1],
                      }),
                    style: {
                      transform: [
                        { scale: this.scale },
                        { translateX: Animated.divide(this.translation.x, this.scale) },
                        { translateY: Animated.divide(this.translation.y, this.scale) },
                      ],
                    },
                  })}
                  theme={controllerTheme}
                />
              </GestureHandler>
            );
          })}
          <Portal>
            <Modal visible={picking} onDismiss={this.closeComponentPicker}>
              <Surface style={Styles.pickerModal}>
                <ScrollView>
                  {this.renderComponents()}
                </ScrollView>
              </Surface>
            </Modal>
          </Portal>
        </View>
      </TapGestureHandler>
    );
  }
}

const mapStateToProps = state => ({
  layouts: state.layouts.layouts,
  controllerTheme: state.preferences.controllerTheme,
});

const mapDispatchToProps = {
  createLayout: LayoutsActions.createLayout,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditorScreen);
