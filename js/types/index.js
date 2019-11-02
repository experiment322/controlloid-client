import PropTypes from 'prop-types';
import { ViewPropTypes } from 'react-native';

export const { style } = ViewPropTypes;

export const {
  any, bool, func, node, number, string, shape, object, objectOf, arrayOf,
} = PropTypes;

export const namedShape = shape({
  name: string.isRequired,
});

export const arrayOfNamedShapes = arrayOf(namedShape);

export const keyedShape = shape({
  key: string.isRequired,
});

export const arrayOfKeyedShapes = arrayOf(keyedShape);

export const component = shape({
  id: number.isRequired,
  type: string.isRequired,
  props: object.isRequired,
});

export const controllerLayout = shape({
  name: string.isRequired,
  components: arrayOf(component).isRequired,
});

export const objectOfControllerLayouts = objectOf(controllerLayout);

export const navigation = shape({
  navigate: func.isRequired,
  goBack: func.isRequired,
  addListener: func.isRequired,
  isFocused: func.isRequired,
  state: object.isRequired,
  setParams: func.isRequired,
  getParam: func.isRequired,
});

export const controllerTheme = shape({
  name: string.isRequired,
  knob: string.isRequired,
  pad: string.isRequired,
});

export const applicationTheme = shape({
  name: string.isRequired,
  dark: bool.isRequired,
  roundness: number.isRequired,
  colors: shape({
    primary: string.isRequired,
    background: string.isRequired,
    surface: string.isRequired,
    accent: string.isRequired,
    error: string.isRequired,
    text: string.isRequired,
    disabled: string.isRequired,
    placeholder: string.isRequired,
    backdrop: string.isRequired,
  }).isRequired,
  fonts: shape({
    regular: string.isRequired,
    medium: string.isRequired,
    light: string.isRequired,
    thin: string.isRequired,
  }).isRequired,
});
