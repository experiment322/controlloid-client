import PropTypes from 'prop-types';

export const {
  func, node, number, string,
} = PropTypes;

export const namedShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
});

export const arrayOfNamedShapes = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
);

export const controllerLayout = PropTypes.shape({
  name: PropTypes.string.isRequired,
  components: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      props: PropTypes.object.isRequired,
    }).isRequired,
  ).isRequired,
});

export const objectOfControllerLayouts = PropTypes.objectOf(
  controllerLayout.isRequired,
);

export const navigation = PropTypes.shape({
  navigate: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  addListener: PropTypes.func.isRequired,
  isFocused: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  setParams: PropTypes.func.isRequired,
  getParam: PropTypes.func.isRequired,
});

export const controllerTheme = PropTypes.shape({
  name: PropTypes.string.isRequired,
  knob: PropTypes.string.isRequired,
  pad: PropTypes.string.isRequired,
});

export const applicationTheme = PropTypes.shape({
  name: PropTypes.string.isRequired,
  dark: PropTypes.bool.isRequired,
  roundness: PropTypes.number.isRequired,
  colors: PropTypes.shape({
    primary: PropTypes.string.isRequired,
    background: PropTypes.string.isRequired,
    surface: PropTypes.string.isRequired,
    accent: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    disabled: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    backdrop: PropTypes.string.isRequired,
  }).isRequired,
  fonts: PropTypes.shape({
    regular: PropTypes.string.isRequired,
    medium: PropTypes.string.isRequired,
    light: PropTypes.string.isRequired,
    thin: PropTypes.string.isRequired,
  }).isRequired,
});
