import React from 'react';
import SvgUri from 'react-native-svg-uri';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Animated, View, ViewPropTypes } from 'react-native';
import * as Types from '../../types';
import { TouchReceiverMixin } from '../utils';
import Styles, { buildContainerStyle } from './styles';

export default class Analog extends TouchReceiverMixin(React.PureComponent) {
  static defaultProps = {
    dispatch: () => null,
    stickerIcon: 'star-three-points',
    analogDeadZone: 0,
    analogStickMax: 32767,
  };

  static propTypes = {
    x: Types.number.isRequired,
    y: Types.number.isRequired,
    size: Types.number.isRequired,
    emitX: Types.string.isRequired,
    emitY: Types.string.isRequired,
    theme: Types.controllerTheme.isRequired,
    style: ViewPropTypes.style,
    dispatch: Types.func,
    stickerIcon: Types.string,
    analogDeadZone: Types.number,
    analogStickMax: Types.number,
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

  constructor(props) {
    super(props);
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
    const {
      dispatch, emitX, emitY, analogDeadZone, analogStickMax,
    } = this.props;
    const clampedPosition = {
      x: Math.min(halfSize, Math.max(-halfSize, position.x - centerX)),
      y: Math.min(halfSize, Math.max(-halfSize, position.y - centerY)),
    };
    // noinspection JSSuspiciousNameCombination
    if (Math.abs(clampedPosition.x) >= (analogDeadZone / 100) * halfSize
      || Math.abs(clampedPosition.y) >= (analogDeadZone / 100) * halfSize) {
      if (clampedPosition.x !== this.translation.x._value // eslint-disable-line max-len, no-underscore-dangle
        || clampedPosition.y !== this.translation.y._value) { // eslint-disable-line max-len, no-underscore-dangle
        dispatch({
          [emitX]: Math.round((clampedPosition.x / halfSize) * analogStickMax),
          [emitY]: Math.round((clampedPosition.y / halfSize) * analogStickMax),
        }, false);
        this.translation.setValue(clampedPosition);
      }
    } else {
      this.analogReset();
    }
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
      x, y, size, theme, stickerIcon, style, ...viewProps
    } = this.props;
    const knobSize = size * 0.75;
    return (
      <Animated.View {...viewProps} style={[style, buildContainerStyle(x, y, size)]}>
        <View style={Styles.overlayContainer}>
          <SvgUri
            width={size}
            height={size}
            svgXmlData={theme.pad}
          />
        </View>
        <Animated.View style={{ transform: this.translation.getTranslateTransform() }}>
          <SvgUri
            width={knobSize}
            height={knobSize}
            svgXmlData={theme.knob}
          />
          <View style={Styles.overlayContainer}>
            <MaterialIcon name={stickerIcon} size={knobSize * 0.5} />
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}
