// @flow

import * as React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native'
import { connect } from 'react-redux';
import { colors } from '../constants/styleGuide';
import { loginUser, requestPasswordReset } from '../redux/user';
import { Error, ERROR_EMPTY_EMAIL } from './Register';
import { Input, InputError, InputWrap, Label } from './Input';
import Button from './UI/Button';
import { StackActions, NavigationActions } from 'react-navigation';

type PasswordResetProps = {

};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    onPasswordReset: (email) => dispatch(requestPasswordReset(email))
});

class PasswordReset extends React.Component<PasswordResetProps> {
    static navigationOptions = {
        title: 'PasswordReset',
    };

    state = {
        email: ''
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

    login() {
        this.props.onPasswordReset(this.state.email)
    }

    render () {
        const {navigation: {navigate}} = this.props;
        return (
            <Container>
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
                <Button onPress={() => this.login()}>
                    PasswordReset
                </Button>
                {!!this.state.errorMessage &&
                <InputError>{this.state.errorMessage}</InputError>
                }
            </Container>
        )
    }
}

const Container = styled.View`
    padding: 40px 20px;
    background-color: ${colors.background};
`;

export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset)
