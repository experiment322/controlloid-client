import storage from 'redux-persist/lib/storage';
import hardSetReconciler from 'redux-persist/lib/stateReconciler/hardSet';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { combineReducers, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { Reducer as PreferencesReducer } from './PreferencesRedux';

const rootReducer = combineReducers({
  preferences: PreferencesReducer,
});

const persistConfig = {
  storage,
  key: 'root',
  keyPrefix: '',
  stateReconciler: hardSetReconciler,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  const store = createStore(persistedReducer, composeWithDevTools());
  const persistor = persistStore(store);
  return {
    store,
    persistor,
  };
};
