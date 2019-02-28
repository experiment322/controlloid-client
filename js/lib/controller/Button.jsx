import React from 'react';
import SvgUri from 'react-native-svg-uri';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Animated, View, ViewPropTypes } from 'react-native';
import * as Types from '../../types';
import { TouchReceiverMixin } from '../utils';
import Styles, { buildContainerStyle } from './styles';

export default class Button extends TouchReceiverMixin(React.PureComponent) {
  static defaultProps = {
    dispatch: () => null,
    stickerIcon: 'star-three-points',
  };

  static propTypes = {
    x: Types.number.isRequired,
    y: Types.number.isRequired,
    size: Types.number.isRequired,
    emit: Types.string.isRequired,
    theme: Types.controllerTheme.isRequired,
    style: ViewPropTypes.style,
    dispatch: Types.func,
    stickerIcon: Types.string,
  };

  constructor(props) {
    super(props);
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
      x, y, size, theme, stickerIcon, style, ...viewProps
    } = this.props;
    return (
      <Animated.View {...viewProps} style={[style, buildContainerStyle(x, y, size)]}>
        <Animated.View style={{ opacity: this.opacity }}>
          <SvgUri
            width={size}
            height={size}
            svgXmlData={theme.knob}
          />
          <View style={Styles.overlayContainer}>
            <MaterialIcon name={stickerIcon} size={size * 0.5} />
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}
