import { createStore, combineReducers } from 'redux';
import authReducer from './reducers/authReducer';
import locationReducer from './reducers/locationReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  location: locationReducer
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
