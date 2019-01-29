import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import { TouchReceiverMixin } from '../lib';

export default class Button extends TouchReceiverMixin(React.Component) {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    fgColor: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    emit: PropTypes.string.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.touchId = null;
    this.opacity = new Animated.Value(1);
  }

  buttonPress() {
    const { dispatch, emit } = this.props;
    dispatch({ [emit]: 1 }, true);
    this.opacity.setValue(0.25);
  }

  buttonRelease() {
    const { dispatch, emit } = this.props;
    dispatch({ [emit]: 0 }, true);
    this.opacity.setValue(1);
  }

  onTouchDown(id) {
    if (this.touchId === null) {
      this.touchId = id;
      this.buttonPress();
      return true;
    }
    return false;
  }

  onTouchMove(touch) {
    if (this.touchId === touch.identifier) {
      const { x, y, size } = this.props;
      if (x > touch.locationX || touch.locationX > x + size
        || y > touch.locationY || touch.locationY > y + size) {
        this.touchId = null;
        this.buttonRelease();
        return false;
      }
    } else if (this.touchId === null) {
      this.touchId = touch.identifier;
      this.buttonPress();
    }
    return true;
  }

  onTouchUp(id) {
    if (this.touchId === id) {
      this.touchId = null;
      this.buttonRelease();
    }
  }

  render() {
    const {
      x, y, size, fgColor, bgColor, ...viewProps
    } = this.props;
    return (
      <Animated.View
        {...viewProps}
        style={{
          top: y,
          left: x,
          width: size,
          aspectRatio: 1,
          borderColor: fgColor,
          borderRadius: size / 2,
          borderWidth: size / 10,
          backgroundColor: bgColor,
          position: 'absolute',
          opacity: this.opacity,
        }}
      />
    );
  }
}
