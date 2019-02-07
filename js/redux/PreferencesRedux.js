import { createActions, createReducer } from 'reduxsauce';
import { LightTheme } from '../interface/themes';
import { ControlloidTheme } from '../lib/controller/themes';

const INITIAL_STATE = {
  controllerTheme: ControlloidTheme,
  applicationTheme: LightTheme,
  analogStickMax: 32767,
  socketMinLatency: 0,
};

export const { Types, Creators: Actions } = createActions({
  setControllerTheme: ['theme'],
  setApplicationTheme: ['theme'],
  setAnalogStickMax: ['value'],
  setSocketMinLatency: ['value'],
  setDefaults: null,
});

export const Reducer = createReducer(INITIAL_STATE, {
  [Types.SET_CONTROLLER_THEME]: (state = INITIAL_STATE, action) => ({
    ...state,
    controllerTheme: action.theme,
  }),
  [Types.SET_APPLICATION_THEME]: (state = INITIAL_STATE, action) => ({
    ...state,
    applicationTheme: action.theme,
  }),
  [Types.SET_ANALOG_STICK_MAX]: (state = INITIAL_STATE, action) => ({
    ...state,
    analogStickMax: action.value,
  }),
  [Types.SET_SOCKET_MIN_LATENCY]: (state = INITIAL_STATE, action) => ({
    ...state,
    socketMinLatency: action.value,
  }),
  [Types.SET_DEFAULTS]: () => INITIAL_STATE,
});
