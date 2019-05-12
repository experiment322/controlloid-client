import AsyncStorage from '@react-native-community/async-storage';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { combineReducers, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { Reducer as LayoutsReducer } from './LayoutsRedux';
import { Reducer as PreferencesReducer } from './PreferencesRedux';

const rootReducer = combineReducers({
  layouts: LayoutsReducer,
  preferences: PreferencesReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
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
