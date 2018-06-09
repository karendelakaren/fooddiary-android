// @flow

import React, { Component } from 'react'
import { Text } from 'react-native'
import createStore from '../createStore'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import RootNavigator from './AppNavigation';
import firebase from 'react-native-firebase';

const { persistor, store } = createStore();

firebase.analytics().setAnalyticsCollectionEnabled(true);
// firebase.crash().setCrashCollectionEnabled(true);

export default class App extends Component<null> {
    componentWillMount() {
        this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
            console.log(user)
        });
    }
    render () {
        return (
            <Provider store={store}>
                <PersistGate
                    persistor={persistor}
                    loading={<Text>Loading</Text>}
                >
                    <RootNavigator />
                </PersistGate>
            </Provider>
        )
    }
}
