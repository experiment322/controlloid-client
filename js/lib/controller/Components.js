export default [
  {
    name: "Left stick",
    type: "Analog",
    props: {
      emitX: "ANALOG_LX",
      emitY: "ANALOG_LY",
      stickerIcon: "alpha-l-box",
    },
  },
  {
    name: "Right stick",
    type: "Analog",
    props: {
      emitX: "ANALOG_RX",
      emitY: "ANALOG_RY",
      stickerIcon: "alpha-r-box",
    },
  },
  {
    name: "L1",
    type: "Button",
    props: {
      emit: "L1",
      stickerIcon: "chevron-left",
    },
  },
  {
    name: "L2",
    type: "Button",
    props: {
      emit: "L2",
      stickerIcon: "chevron-double-left",
    },
  },
  {
    name: "R1",
    type: "Button",
    props: {
      emit: "R1",
      stickerIcon: "chevron-right",
    },
  },
  {
    name: "R2",
    type: "Button",
    props: {
      emit: "R2",
      stickerIcon: "chevron-double-right",
    },
  },
  {
    name: "Triangle",
    type: "Button",
    props: {
      emit: "TRIANGLE",
      stickerIcon: "triangle-outline",
    },
  },
  {
    name: "Cross",
    type: "Button",
    props: {
      emit: "CROSS",
      stickerIcon: "close-outline",
    },
  },
  {
    name: "Square",
    type: "Button",
    props: {
      emit: "SQUARE",
      stickerIcon: "square-outline",
    },
  },
  {
    name: "Circle",
    type: "Button",
    props: {
      emit: "CIRCLE",
      stickerIcon: "circle-outline",
    },
  },
  {
    name: "Up",
    type: "Button",
    props: {
      emit: "UP",
      stickerIcon: "arrow-up-bold-outline",
    },
  },
  {
    name: "Down",
    type: "Button",
    props: {
      emit: "DOWN",
      stickerIcon: "arrow-down-bold-outline",
    },
  },
  {
    name: "Left",
    type: "Button",
    props: {
      emit: "LEFT",
      stickerIcon: "arrow-left-bold-outline",
    },
  },
  {
    name: "Right",
    type: "Button",
    props: {
      emit: "RIGHT",
      stickerIcon: "arrow-right-bold-outline",
    },
  },
  {
    name: "Select",
    type: "Button",
    props: {
      emit: "SELECT",
      stickerIcon: "minus",
    },
  },
  {
    name: "Start",
    type: "Button",
    props: {
      emit: "START",
      stickerIcon: "play",
    },
  },
];
