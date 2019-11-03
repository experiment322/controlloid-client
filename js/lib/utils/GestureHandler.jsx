import React from "react";
import { PanGestureHandler, PinchGestureHandler, State } from "react-native-gesture-handler";
import * as Types from "../../types";

export default class GestureHandler extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeGestureCount: 0,
    };
    this.panRef = React.createRef();
    this.pinchRef = React.createRef();
  }

  handleStateChange = ({ nativeEvent: { oldState, state } }) => {
    const { activeGestureCount } = this.state;
    const { onGestureBegin, onGestureTerminate } = this.props;
    if (state === State.ACTIVE) {
      if (activeGestureCount === 0) {
        onGestureBegin();
      }
      this.setState({ activeGestureCount: activeGestureCount + 1 });
    } else if (oldState === State.ACTIVE) {
      if (activeGestureCount === 1) {
        onGestureTerminate();
      }
      this.setState({ activeGestureCount: activeGestureCount - 1 });
    }
  };

  render() {
    const { activeGestureCount } = this.state;
    const { children, onPanEvent, onPinchEvent, enabled } = this.props;
    return (
      <PanGestureHandler
        ref={this.panRef}
        simultaneousHandlers={this.pinchRef}
        onHandlerStateChange={this.handleStateChange}
        onGestureEvent={onPanEvent}
        enabled={enabled}
        minDist={0}
        avgTouches
      >
        <PinchGestureHandler
          ref={this.pinchRef}
          simultaneousHandlers={this.panRef}
          onHandlerStateChange={this.handleStateChange}
          onGestureEvent={onPinchEvent}
          hitSlop={activeGestureCount > 0 ? Number.MAX_SAFE_INTEGER : 0}
        >
          {children}
        </PinchGestureHandler>
      </PanGestureHandler>
    );
  }
}

GestureHandler.propTypes = {
  children: Types.node.isRequired,
  onPanEvent: Types.func.isRequired,
  onPinchEvent: Types.func.isRequired,
  onGestureBegin: Types.func.isRequired,
  onGestureTerminate: Types.func.isRequired,
  enabled: Types.bool,
};

GestureHandler.defaultProps = {
  enabled: true,
};
