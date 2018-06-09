// @flow

import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import thunk from 'redux-thunk';
import reducers from './redux';

const config = {
    key: 'root',
    storage
};

const appReducers = persistCombineReducers(config, reducers);

const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT') {
        state = {
            _persist: state['_persist'],
        }
    }

    return appReducers(state, action)
};

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
    const store = createStore(
        rootReducer,
        composeEnhancers(applyMiddleware(thunk))
    );

    const persistor = persistStore(store);

    return {persistor, store}
}
