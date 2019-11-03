import _ from "lodash";
import React from "react";
import { View } from "react-native";
import * as Types from "../../types";

export default class TouchDispenser extends React.PureComponent {
  childRefs = [];

  childLayouts = [];

  touchRegisteredChildren = {};

  registerTouch = (touchId, childIndexes) => {
    this.touchRegisteredChildren[touchId] = [];
    _.forEach(childIndexes, (childIndex) => {
      const child = this.childRefs[childIndex].current;
      if (child.isTouchReceiver && child.onTouchDown(Number(touchId))) {
        this.touchRegisteredChildren[touchId].push(childIndex);
      }
    });
  };

  unregisterTouch = (touchId) => {
    _.forEach(this.touchRegisteredChildren[touchId], (childIndex) => {
      const child = this.childRefs[childIndex].current;
      if (child.isTouchReceiver) {
        child.onTouchUp(Number(touchId));
      }
    });
    delete this.touchRegisteredChildren[touchId];
  };

  getChildrenUnderTouch = (x, y) =>
    _.transform(
      this.childLayouts,
      (result, layout, index) => {
        if (
          layout.x <= x &&
          x <= layout.x + layout.width &&
          layout.y <= y &&
          y <= layout.y + layout.height
        ) {
          result.push(index);
        }
      },
      [],
    );

  setResponder = () => true;

  releaseResponder = () => true;

  handleEvent = ({ nativeEvent: { touches } }) => {
    const currTouches = _.keyBy(touches, "identifier");

    const newTouchesIds = _.filter(
      _.keys(currTouches),
      (touchId) => !_.has(this.touchRegisteredChildren, touchId),
    );
    _.forEach(newTouchesIds, (touchId) => {
      this.registerTouch(
        touchId,
        this.getChildrenUnderTouch(currTouches[touchId].locationX, currTouches[touchId].locationY),
      );
    });

    const oldTouchesIds = _.filter(
      _.keys(this.touchRegisteredChildren),
      (touchId) => !_.has(currTouches, touchId),
    );
    _.forEach(oldTouchesIds, (touchId) => {
      this.unregisterTouch(touchId);
    });

    _.forEach(currTouches, (touch, touchId) => {
      const touchedChildren = this.getChildrenUnderTouch(touch.locationX, touch.locationY);
      const registeredChildren = this.touchRegisteredChildren[touchId];
      _.forEach(_.union(touchedChildren, registeredChildren), (childIndex) => {
        const child = this.childRefs[childIndex].current;
        const index = registeredChildren.indexOf(childIndex);
        const isRegistered = index !== -1;
        if (child.isTouchReceiver && child.onTouchMove(touch)) {
          if (!isRegistered) registeredChildren.push(childIndex);
        } else if (isRegistered) registeredChildren.splice(index, 1);
      });
    });
  };

  terminateEvent = () => {
    _.forEach(_.keys(this.touchRegisteredChildren), (touchId) => {
      this.unregisterTouch(touchId);
    });
  };

  buildGestureResponder = () => ({
    onStartShouldSetResponder: this.setResponder,
    onMoveShouldSetResponder: this.setResponder,
    onResponderTerminationRequest: this.releaseResponder,

    onResponderGrant: this.handleEvent,
    onResponderMove: this.handleEvent,

    onResponderRelease: this.terminateEvent,
    onResponderTerminate: this.terminateEvent,
  });

  render() {
    const { children, ...viewProps } = this.props;
    return (
      <View {...viewProps} {...this.buildGestureResponder()} pointerEvents="box-only">
        {React.Children.map(children, (child, index) => {
          const originalOnLayout = child.props.onLayout;
          this.childRefs[index] = React.createRef();
          return React.cloneElement(child, {
            ref: this.childRefs[index],
            onLayout: (event) => {
              this.childLayouts[index] = event.nativeEvent.layout;
              if (originalOnLayout) originalOnLayout(event);
            },
          });
        })}
      </View>
    );
  }
}

TouchDispenser.propTypes = {
  children: Types.node.isRequired,
};
