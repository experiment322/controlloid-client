import { createActions, createReducer } from 'reduxsauce';
import { LightTheme } from '../interface/themes';

const INITIAL_STATE = {
  activeTheme: LightTheme,
  analogStickMax: 32767,
  socketMinLatency: 0,
};

export const { Types, Creators: Actions } = createActions({
  setActiveTheme: ['activeTheme'],
  setAnalogStickMax: ['analogStickMax'],
  setSocketMinLatency: ['socketMinLatency'],
  setDefaults: null,
});

export const Reducer = createReducer(INITIAL_STATE, {
  [Types.SET_ACTIVE_THEME]: (state = INITIAL_STATE, action) => ({
    ...state,
    activeTheme: action.activeTheme,
  }),
  [Types.SET_ANALOG_STICK_MAX]: (state = INITIAL_STATE, action) => ({
    ...state,
    analogStickMax: action.analogStickMax,
  }),
  [Types.SET_SOCKET_MIN_LATENCY]: (state = INITIAL_STATE, action) => ({
    ...state,
    socketMinLatency: action.socketMinLatency,
  }),
  [Types.SET_DEFAULTS]: () => INITIAL_STATE,
});
