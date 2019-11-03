import _ from "lodash";
import React from "react";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Animated } from "react-native";
import { PanGestureHandler, State, TapGestureHandler } from "react-native-gesture-handler";
import * as Types from "../../types";
import { Controls } from "../../lib/controller";

const BUTTON_SIZE = 32;

export default class ComponentEditorBox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.deltaSize = new Animated.Value(0);
    this.translationX = new Animated.Value(0);
    this.translationY = new Animated.Value(0);
  }

  onDeleteStateChange = ({ nativeEvent: { oldState } }) => {
    const { component, onUpdate } = this.props;
    if (oldState === State.ACTIVE) {
      onUpdate(component, null, false);
    }
  };

  renderDeleteButton = () => {
    const {
      focused,
      component: {
        props: { x, y },
      },
    } = this.props;
    if (!focused) {
      return null;
    }
    return (
      <TapGestureHandler onHandlerStateChange={this.onDeleteStateChange}>
        <Animated.View
          style={{
            position: "absolute",
            top: Animated.add(y - BUTTON_SIZE, Animated.divide(this.deltaSize, -2)),
            left: Animated.add(x - BUTTON_SIZE, Animated.divide(this.deltaSize, -2)),
            transform: [{ translateY: this.translationY }, { translateX: this.translationX }],
          }}
        >
          <MaterialIcon name="delete-outline" color="firebrick" size={BUTTON_SIZE} />
        </Animated.View>
      </TapGestureHandler>
    );
  };

  onResizeStateChange = ({ nativeEvent: { oldState, translationX } }) => {
    const { component, onUpdate } = this.props;
    if (oldState === State.ACTIVE) {
      const resizedComponent = _.cloneDeep(component);
      resizedComponent.props.size += translationX;
      onUpdate(component, resizedComponent, true);
      this.deltaSize.setValue(0);
    }
  };

  renderResizeButton = () => {
    const {
      focused,
      component: {
        props: { x, y, size },
      },
    } = this.props;
    if (!focused) {
      return null;
    }
    return (
      <PanGestureHandler
        onGestureEvent={Animated.event([
          {
            nativeEvent: {
              translationX: this.deltaSize,
            },
          },
        ])}
        onHandlerStateChange={this.onResizeStateChange}
      >
        <Animated.View
          style={{
            position: "absolute",
            top: Animated.add(y + size, Animated.divide(this.deltaSize, 2)),
            left: Animated.add(x + size, Animated.divide(this.deltaSize, 2)),
            transform: [{ translateY: this.translationY }, { translateX: this.translationX }],
          }}
        >
          <MaterialIcon name="arrow-expand-horizontal" color="goldenrod" size={BUTTON_SIZE} />
        </Animated.View>
      </PanGestureHandler>
    );
  };

  onFocusStateChange = ({ nativeEvent: { oldState } }) => {
    const { focused, component, onUpdate } = this.props;
    if (oldState === State.ACTIVE) {
      onUpdate(component, component, !focused);
    }
  };

  onMoveStateChange = ({ nativeEvent: { oldState, state, translationX, translationY } }) => {
    const { focused, component, onUpdate } = this.props;
    if (state === State.ACTIVE) {
      if (!focused) {
        onUpdate(component, component, true);
      }
    } else if (oldState === State.ACTIVE) {
      const movedComponent = _.cloneDeep(component);
      movedComponent.props.x += translationX;
      movedComponent.props.y += translationY;
      onUpdate(component, movedComponent, true);
      this.translationY.setValue(0);
      this.translationX.setValue(0);
    }
  };

  render() {
    const { focused, component, theme } = this.props;
    const ControllerComponent = Controls[component.type];
    const scale = Animated.divide(
      Animated.add(this.deltaSize, component.props.size),
      component.props.size,
    );
    return (
      <>
        <TapGestureHandler onHandlerStateChange={this.onFocusStateChange}>
          <PanGestureHandler
            onGestureEvent={Animated.event([
              {
                nativeEvent: {
                  translationX: this.translationX,
                  translationY: this.translationY,
                },
              },
            ])}
            onHandlerStateChange={this.onMoveStateChange}
          >
            <ControllerComponent
              {...component.props}
              theme={theme}
              style={{
                borderWidth: 1,
                borderColor: "lime",
                backgroundColor: focused ? "#00ff0064" : "transparent",
                transform: [
                  { scale },
                  { translateY: Animated.divide(this.translationY, scale) },
                  { translateX: Animated.divide(this.translationX, scale) },
                ],
              }}
            />
          </PanGestureHandler>
        </TapGestureHandler>
        {this.renderDeleteButton()}
        {this.renderResizeButton()}
      </>
    );
  }
}

ComponentEditorBox.propTypes = {
  theme: Types.controllerTheme.isRequired,
  focused: Types.bool.isRequired,
  component: Types.component.isRequired,
  onUpdate: Types.func.isRequired,
};
