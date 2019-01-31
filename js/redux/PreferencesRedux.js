import { createActions, createReducer } from 'reduxsauce';

const INITIAL_STATE = {
  analogStickMax: 32767,
  socketMinLatency: 0,
};

export const { Types, Creators: Actions } = createActions({
  setDefaults: null,
  setAnalogStickMax: ['analogStickMax'],
  setSocketMinLatency: ['socketMinLatency'],
});

export const Reducer = createReducer(INITIAL_STATE, {
  [Types.SET_DEFAULTS]: () => INITIAL_STATE,
  [Types.SET_ANALOG_STICK_MAX]: (state = INITIAL_STATE, action) => ({
    ...state,
    analogStickMax: action.analogStickMax,
  }),
  [Types.SET_SOCKET_MIN_LATENCY]: (state = INITIAL_STATE, action) => ({
    ...state,
    socketMinLatency: action.socketMinLatency,
  }),
});
