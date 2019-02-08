import React from 'react';
import SvgUri from 'react-native-svg-uri';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Animated, View } from 'react-native';
import * as Types from '../../types';
import { TouchReceiverMixin } from '../utils';
import Styles, { buildContainerStyle } from './styles';

export default class Analog extends TouchReceiverMixin(React.Component) {
  static defaultProps = {
    stickerIcon: 'star-three-points',
  };

  static propTypes = {
    x: Types.number.isRequired,
    y: Types.number.isRequired,
    size: Types.number.isRequired,
    emitX: Types.string.isRequired,
    emitY: Types.string.isRequired,
    theme: Types.controllerTheme.isRequired,
    dispatch: Types.func.isRequired,
    analogStickMax: Types.number.isRequired,
    stickerIcon: Types.string,
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
      dispatch, emitX, emitY, analogStickMax,
    } = this.props;
    const clampedPosition = {
      x: Math.min(halfSize, Math.max(-halfSize, position.x - centerX)),
      y: Math.min(halfSize, Math.max(-halfSize, position.y - centerY)),
    };
    dispatch({
      [emitX]: Math.round((clampedPosition.x / halfSize) * analogStickMax),
      [emitY]: Math.round((clampedPosition.y / halfSize) * analogStickMax),
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
      x, y, size, theme, stickerIcon, ...viewProps
    } = this.props;
    const knobSize = size * 0.75;
    return (
      <View {...viewProps} style={buildContainerStyle(x, y, size)}>
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
            <Icon name={stickerIcon} size={knobSize * 0.5} />
          </View>
        </Animated.View>
      </View>
    );
  }
}
