// @flow

import * as React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native'
import { connect } from 'react-redux';
import { formatDate } from '../services/utils';
import { colors } from '../constants/styleGuide';
import firebase from 'react-native-firebase';
import { getBuddies } from '../redux/buddies';
import { getMeals } from '../redux/food';
import { logout } from '../redux/user';

type MainProps = {

};

const mapStateToProps = (state) => ({
    entries: state.food.entries
});

const mapDispatchToProps = (dispatch) => ({
    onGetBuddies: () => dispatch(getBuddies()),
    onGetMeals: () => dispatch(getMeals()),
    onLogout: () => dispatch(logout())
})

class Main extends React.Component<MainProps> {
    componentWillMount () {
        this.props.onGetBuddies();
        this.props.onGetMeals();
    }

    render () {
        const {navigation: {navigate}} = this.props;
        return (
            <Container>
                <TouchableOpacity onPress={() => navigate('newEntry')}>
                    <Text>New entry</Text>
                </TouchableOpacity>
                <FlatList
                    data={this.props.entries}
                    keyExtractor={(item, i) => i}
                    renderItem={({item}) => (
                        <Entry>
                            {!!item.photo &&
                                <View style={{flexDirection: 'row'}}>
                                <Image source={{uri: item.photo}} style={{flex: 1, height: 300}}/>
                                </View>
                            }
                            <EntryDate>{item.date && formatDate(item.date)}</EntryDate>
                            <Name>{item.name.toUpperCase()}</Name>
                            <Description>{item.description}</Description>
                            <Buddies>
                                <BuddyIcon source={require('../assets/images/users.png')} resizeMode="contain" />
                                {item.buddies && item.buddies.map((buddy) => buddy.name).join(', ')}
                            </Buddies>
                            <LocationIcon source={require('../assets/images/location.png')} resizeMode="contain" />
                            <Buddies>{item.location}</Buddies>
                        </Entry>
                    )}
                />
                <TouchableOpacity onPress={() => this.props.onLogout()}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </Container>
        )
    }
}

const Container = styled.View`
    padding: 40px 0;
    background-color: ${colors.background};
`;

const Entry = styled.View`
    borderBottomColor: ${colors.highlightBackground};
    borderBottomWidth: 1;
    padding: 5px 0;
    margin: 0 20px;
`;

const Name = styled.Text`
    font-family: 'OpenSans-Bold';
    color: ${colors.peach};
    font-size: 16px;
`;

const Description = styled.Text`
    color: black;
`;

const EntryDate = styled.Text`
    color: black;
    font-family: 'OpenSans-Bold';
    font-size: 10px;
    opacity: 0.8;
`;

const Buddies = styled.Text`
    color: black;
`;

const BuddyIcon = styled.Image`
    height: 14px;
    width: 18px;
`;

const LocationIcon = styled.Image`
    height: 16px;
    width: 18px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Main)
