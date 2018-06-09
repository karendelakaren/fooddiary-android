// @flow

import * as React from 'react';
import { ImageBackground, View, Dimensions } from 'react-native';
import styled from 'styled-components/native'
import { connect } from 'react-redux';
import Register from './Register';
import { StackActions, NavigationActions } from 'react-navigation';
import Button from './UI/Button';

type WelcomeProps = {

};

const mapStateToProps = (state) => ({
    loggedIn: state.user.loggedIn
});

const mapDispatchToProps = (dispatch) => ({

})

class Welcome extends React.Component<WelcomeProps> {
    static navigationOptions = {
        header: null
    };

    componentWillMount() {
        if (this.props.loggedIn) {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'main'})
                ]
            });
            this.props.navigation.dispatch(resetAction)
        }
    }

    render () {
        const {navigation: {navigate}} = this.props;
        return (
            <ImageBackground source={require('../assets/images/food.jpg')} style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
                <Container>
                    <Title>Welcome</Title>
                    <SeeThroughBlock>
                        <SubTitle>Have an account?</SubTitle>

                            <Button onPress={() => navigate('login')}>
                                Go to login
                            </Button>
                    </SeeThroughBlock>
                    <SeeThroughBlock>
                        <SubTitle>Or new to food diary? Create an account so we can forever save your meals</SubTitle>
                        <Register navigation={this.props.navigation} />
                    </SeeThroughBlock>
                </Container>
            </ImageBackground>
        )
    }
}

const Container = styled.View`
    padding: 40px 10px;
`;

const Title = styled.Text`
    font-size: 24px;
    background-color: transparent;
`;

const SubTitle = styled.Text`
    font-size: 14px
`;

export const SeeThroughBlock = styled.View`
    backgroundColor: #FFFFFFEE;
    border-radius: 6px;
    padding: 10px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
