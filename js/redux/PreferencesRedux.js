import { createActions, createReducer } from 'reduxsauce';
import { DarkTheme } from '../interface/themes';
import { ControlloidTheme } from '../lib/controller/themes';

const INITIAL_STATE = {
  controllerTheme: ControlloidTheme,
  applicationTheme: DarkTheme,
  analogDeadZone: 33,
  analogStickMax: 32767,
  socketMinLatency: 10,
};

export const { Types, Creators: Actions } = createActions({
  setControllerTheme: ['theme'],
  setApplicationTheme: ['theme'],
  setAnalogDeadZone: ['value'],
  setAnalogStickMax: ['value'],
  setSocketMinLatency: ['value'],
  setDefaults: null,
});

export const Reducer = createReducer(INITIAL_STATE, {
  [Types.SET_CONTROLLER_THEME]: (state, action) => ({
    ...state,
    controllerTheme: action.theme,
  }),
  [Types.SET_APPLICATION_THEME]: (state, action) => ({
    ...state,
    applicationTheme: action.theme,
  }),
  [Types.SET_ANALOG_DEAD_ZONE]: (state, action) => ({
    ...state,
    analogDeadZone: action.value,
  }),
  [Types.SET_ANALOG_STICK_MAX]: (state, action) => ({
    ...state,
    analogStickMax: action.value,
  }),
  [Types.SET_SOCKET_MIN_LATENCY]: (state, action) => ({
    ...state,
    socketMinLatency: action.value,
  }),
  [Types.SET_DEFAULTS]: () => INITIAL_STATE,
});
