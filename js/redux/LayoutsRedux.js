import _ from 'lodash';
import { createActions, createReducer } from 'reduxsauce';

const INITIAL_STATE = {
  layouts: {},
  activeLayout: null,
};

export const { Types, Creators: Actions } = createActions({
  createLayout: ['name', 'layout'],
  deleteLayout: ['name'],
  setActiveLayout: ['name'],
});

export const Reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_LAYOUT]: (state, action) => ({
    ...state,
    layouts: {
      ...state.layouts,
      [action.name]: action.layout,
    },
  }),
  [Types.DELETE_LAYOUT]: (state, action) => ({
    ...state,
    layouts: _.omit(state.layouts, [action.name]),
    activeLayout: action.name === state.activeLayout ? null : state.activeLayout,
  }),
  [Types.SET_ACTIVE_LAYOUT]: (state, action) => ({
    ...state,
    activeLayout: action.name,
  }),
});
