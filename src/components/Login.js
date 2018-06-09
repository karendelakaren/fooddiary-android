// @flow

import * as React from 'react';
import styled from 'styled-components/native'
import { connect } from 'react-redux';
import { colors } from '../constants/styleGuide';
import { loginUser} from '../redux/user';
import { ERROR_EMPTY_EMAIL } from './Register';
import { Input, InputError, InputWrap, Label } from './Input';
import Button from './UI/Button';
import { StackActions, NavigationActions } from 'react-navigation';

type LoginProps = {

};

const mapStateToProps = (state) => ({
    error: state.user.errorLogin,
    loggedIn: state.user.loggedIn
});

const mapDispatchToProps = (dispatch) => ({
    onLoginUser: (email, password) => dispatch(loginUser(email, password))
});

class Login extends React.Component<LoginProps> {
    static navigationOptions = {
        title: 'Login',
    };

    state = {
        email: '',
        password: '',
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

    login() {
        this.props.onLoginUser(this.state.email, this.state.password)
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
                />
                {!!this.state.errorMessagePassword &&
                <InputError>{this.state.errorMessagePassword}</InputError>
                }
                <Button onPress={() => this.login()}>
                    Login
                </Button>
                <Button onPress={() => navigate('passwordReset')}>
                    Forgotten password?
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

export default connect(mapStateToProps, mapDispatchToProps)(Login)
