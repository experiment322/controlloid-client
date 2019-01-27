import React from 'react';
import PropTypes from 'prop-types';
import { Animated, View } from 'react-native';
import { TouchReceiverMixin } from '../input';

const ANALOG_STICK_MAX = 32767;

export default class Analog extends TouchReceiverMixin(React.Component) {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    fgColor: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    emitX: PropTypes.string.isRequired,
    emitY: PropTypes.string.isRequired,
  };

  static getDerivedStateFromProps({ x, y, size }, { centerX, centerY, halfSize }) {
    if (halfSize !== size / 2 || x + size / 2 !== centerX || y + size / 2 !== centerY) {
      return {
        centerX: x + size / 2,
        centerY: y + size / 2,
        halfSize: size / 2,
      };
    }
    return null;
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      centerX: 0,
      centerY: 0,
      halfSize: 0,
    };
    this.touchId = null;
    this.translation = new Animated.ValueXY();
  }

  analogMove(position) {
    const { centerX, centerY, halfSize } = this.state;
    const clampedPosition = {
      x: Math.min(halfSize, Math.max(-halfSize, position.x - centerX)),
      y: Math.min(halfSize, Math.max(-halfSize, position.y - centerY)),
    };
    const { dispatch, emitX, emitY } = this.props;
    dispatch({
      [emitX]: Math.round((clampedPosition.x / halfSize) * ANALOG_STICK_MAX),
      [emitY]: Math.round((clampedPosition.y / halfSize) * ANALOG_STICK_MAX),
    }, false);
    this.translation.setValue(clampedPosition);
  }

  analogReset() {
    const { dispatch, emitX, emitY } = this.props;
    dispatch({
      [emitX]: 0,
      [emitY]: 0,
    }, true);
    this.translation.setValue({
      x: 0,
      y: 0,
    });
  }

  onTouchDown(id) {
    if (this.touchId === null) {
      this.touchId = id;
      this.analogReset();
      return true;
    }
    return false;
  }

  onTouchMove(touch) {
    if (this.touchId === touch.identifier) {
      this.analogMove({
        x: touch.locationX,
        y: touch.locationY,
      });
      return true;
    }
    return false;
  }

  onTouchUp(id) {
    if (this.touchId === id) {
      this.touchId = null;
      this.analogReset();
    }
  }

  render() {
    const {
      x, y, size, fgColor, bgColor, ...viewProps
    } = this.props;
    return (
      <View
        {...viewProps}
        style={{
          top: y,
          left: x,
          width: size,
          aspectRatio: 1,
          borderRadius: size / 10,
          backgroundColor: bgColor,
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            width: size / 1.25,
            aspectRatio: 1,
            borderRadius: (size / 1.25) / 2,
            backgroundColor: fgColor,
            transform: this.translation.getTranslateTransform(),
          }}
        />
      </View>
    );
  }
}
