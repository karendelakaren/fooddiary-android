// @flow

import * as React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native'
import { connect } from 'react-redux';
import { colors } from '../constants/styleGuide';
import { registerUser } from '../redux/user';
import { StackActions, NavigationActions } from 'react-navigation'
import { SeeThroughBlock } from './Welcome';
import Button from './UI/Button';
import { Input, InputError, InputWrap, Label } from './Input';

type RegisterProps = {

};

const mapStateToProps = (state) => ({
    error: state.user.errorRegister,
    loggedIn: state.user.loggedIn
});

const mapDispatchToProps = (dispatch) => ({
    onRegisterUser: (email, password) => dispatch(registerUser(email, password))
});

const ERROR_PASSWORDS_DONT_MATCH = 'Oops, looks like these are not the same passwords';
export const ERROR_EMPTY_EMAIL = 'Oops, looks like you forgot to fill in your email address';
const ERROR_EMPTY_PASSWORD = 'A diary without a password is like a tomato soup without tomato. Please fill in your password'

    class Register extends React.Component<RegisterProps> {
    state = {
        email: '',
        password: '',
        password2: '',
        errorMessageEmail: '',
        errorMessagePassword: '',
        errorMessage: ''
    };

    componentWillReceiveProps(newProps) {
        if (newProps.loggedIn) {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'main'})
                ]
            });
            this.props.navigation.dispatch(resetAction)
        }

        if (newProps.error && (!this.props.error || newProps.error.code !== this.props.error.code)) {
            if (newProps.error.type === 'email') {
                this.setState({errorMessageEmail: newProps.error.message})
            } else if (newProps.error.type === 'password') {
                this.setState({ errorMessagePassword: newProps.error.message})
            } else {
                this.setState({errorMessage: newProps.error.message})
            }
        }
    }

    register() {
        if (!this.state.email) {
            this.setState({errorMessageEmail: ERROR_EMPTY_EMAIL })
        }
        if (!this.state.password) {
            this.setState({errorMessagePassword: ERROR_EMPTY_PASSWORD})
        } else if (this.state.password !== this.state.password2) {
            this.setState({errorMessagePassword: ERROR_PASSWORDS_DONT_MATCH})
        } else if (this.state.email) {
            console.log('reached it')
            this.setState({errorMessageEmail: '', errorMessagePassword: ''})
            this.props.onRegisterUser(this.state.email, this.state.password)
        }
    }

    render () {
        const {navigation: {navigate}} = this.props;
        return (
            <View>
                <InputWrap>
                    <Label>Email</Label>
                    <Input
                        value={this.state.email}
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        disableFullscreenUI
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => this.setState({email: text})}
                        onBlur={() => {
                            if (!this.state.email) {
                                this.setState({
                                    errorMessageEmail: ERROR_EMPTY_EMAIL
                                })
                            }
                        }}
                    />
                    {!!this.state.errorMessageEmail &&
                    <InputError>{this.state.errorMessageEmail}</InputError>
                    }
                </InputWrap>
                <InputWrap>
                    <Label>Password</Label>
                    <Input
                        value={this.state.password}
                        autoCorrect={false}
                        autoCapitalize="none"
                        secureTextEntry
                        selectTextOnFocus
                        disableFullscreenUI
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => this.setState({password: text})}
                        onBlur={()=> {
                            if (this.state.password2 && this.state.password !== this.state.password2) {
                                this.setState({errorMessagePassword: ERROR_PASSWORDS_DONT_MATCH})
                            } else {
                                this.setState({errorMessagePassword: ''})
                            }
                        }}
                    />
                </InputWrap>
                <InputWrap>
                    <Label>Repeat password</Label>
                    <Input
                        value={this.state.password2}
                        autoCorrect={false}
                        autoCapitalize="none"
                        secureTextEntry
                        selectTextOnFocus
                        disableFullscreenUI
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => this.setState({password2: text})}
                        onBlur={()=> {
                            if (this.state.password !== this.state.password2) {
                                this.setState({errorMessagePassword: ERROR_PASSWORDS_DONT_MATCH})
                            } else {
                                this.setState({errorMessagePassword: ''})
                            }
                        }}
                    />
                    {!!this.state.errorMessagePassword &&
                        <InputError>{this.state.errorMessagePassword}</InputError>
                    }
                </InputWrap>
                <Button onPress={() => this.register()}>
                    Register
                </Button>
                {!!this.state.errorMessage &&
                <InputError>{this.state.errorMessage}</InputError>
                }
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)
