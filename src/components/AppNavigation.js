// @flow

import { StackNavigator } from 'react-navigation'
import Main from './Main';
import NewEntry from './NewEntry';
import Login from './Login';
import Welcome from './Welcome';
import PasswordReset from './PasswordReset';

const RootNavigator = StackNavigator({
    welcome: {screen: Welcome},
    login: {screen: Login},
    passwordReset: {screen: PasswordReset},
    main: {screen: Main},
    newEntry: {screen: NewEntry}
}, {

});

export default RootNavigator
