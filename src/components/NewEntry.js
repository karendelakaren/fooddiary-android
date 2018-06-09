// @flow

import * as React from 'react';
import { Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, DatePickerIOS, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native'
import { connect } from 'react-redux';
import { createNewEntry } from '../redux/food';
import { addBuddy } from '../redux/buddies';
import { colors } from '../constants/styleGuide';
import { mealTypes } from '../constants/mealTypes';
import { locationTypes } from '../constants/locationTypes';
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';

type NewEntryProps = {

};

const mapStateToProps = (state) => ({
    buddies: state.buddies.buddies
});

const mapDispatchToProps = (dispatch) => ({
    onCreateEntry: (entry) => dispatch(createNewEntry(entry)),
    onAddBuddy: (buddy) => dispatch(addBuddy(buddy))
});

class NewEntry extends React.Component<NewEntryProps> {
    state = {
        name: '',
        description: '',
        date: new Date(),
        buddy: '',
        buddies: [],
        location: '',
        website: '',
        type: 'dinner',
        notes: '',
        photo: '',
        image: ''
    };

    addImage () {
        ImagePicker.launchImageLibrary({}, (imageResponse)  => {
            this.setState({image: imageResponse.uri})
            firebase.storage().ref(imageResponse.fileName).putFile(imageResponse.uri, {
                contentType: 'image/jpeg',
                timeCreated: imageResponse.timestamp
            })
                .then(response => {
                    this.setState({photo: response.downloadURL})
                }).catch(error => {
                console.log(error)
            })
        });
    }

    addEntry () {
        const entry = {
            name: this.state.name,
            description: this.state.description,
            buddies: this.state.buddies,
            date: this.state.date,
            location: this.state.location,
            type: this.state.type,
            notes: this.state.notes,
            photo: this.state.photo
        };
        this.props.onCreateEntry(entry)
    }

    addBuddy () {
        if (this.state.buddy) {
            this.props.onAddBuddy(this.state.buddy);
            this.setState({
                buddies: [...this.state.buddies, this.state.buddy],
                buddy: ''
            });
        }
    }

    fetchWebsite () {

        const url = this.state.website;
        fetch(url).then((reponse) => {
            return reponse.text()
        }).then(body => {
            const matchSiteName = body.match(/<meta.name="application-name".*content="(.*)".*\/>/);
            console.log(matchSiteName);
            const matchAppName = body.match(/<meta.*property="og:site_name".*content="(.*)".*\/>/);
            console.log(matchAppName);
            const matchTitle = body.match(/<title>(.*?)<\/title>/);
            console.log(matchTitle);
        });
    }

    render () {
        const {navigation: {navigate}} = this.props;
        console.log(this.state.photo, this.state.image)
        return (
            <Container>
                <KeyboardAwareScrollView keyboardDismissMode="interactive">
                    <Wrap>
                        <Label>Name</Label>
                        <Input
                            onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                            returnKeyType="next"
                        />
                        <Label>Type</Label>
                        <TypeButtons>
                            {Object.keys(mealTypes).map(type => (
                                <TypeButton
                                    key={type}
                                    active={type === this.state.type}
                                    onPress={() => this.setState({type})}
                                >
                                    <TypeButtonText>{mealTypes[type]}</TypeButtonText>
                                </TypeButton>
                            ))}
                        </TypeButtons>
                        <Label>Description</Label>
                        <InputArea
                            multiline
                            onChangeText={(description) => this.setState({description})}
                            value={this.state.description}
                            returnKeyType="next"
                        />
                        <Label>Date</Label>
                        <DatePickerIOS
                            date={this.state.date}
                            mode="date"
                            onDateChange={(date) => this.setState({date})}
                        />
                        <DinnerWithContainer>
                            <DinnerWith>Together with: </DinnerWith>
                            {this.state.buddies.map((buddy, i) => (
                                <Tag
                                    key={i}
                                    onPress={() => this.setState({
                                        buddies: this.state.buddies.filter((selectedBuddy) => selectedBuddy !== buddy)
                                    })}
                                >
                                    <TagText >{this.props.buddies[buddy].name}</TagText>
                                </Tag>
                            ))}
                        </DinnerWithContainer>
                        <View>
                        <Input
                            onChangeText={(buddy) => this.setState({buddy})}
                            value={this.state.buddy}
                        />
                            <AddBuddyButton onPress={() => this.addBuddy()}>
                                <AddBuddyButtonText>
                                    +
                                </AddBuddyButtonText>
                            </AddBuddyButton>
                        </View>

                        <TagContainer>
                        {Object.keys(this.props.buddies).map((buddyKey, i) => (
                            <Tag key={i} onPress={() => this.setState({buddies: [...this.state.buddies, buddyKey]})}>
                                <TagText >{this.props.buddies[buddyKey].name}</TagText>
                            </Tag>
                        ))}
                        </TagContainer>

                        <Label>Location</Label>
                        <TypeButtons>
                            {Object.keys(locationTypes).map(type => (
                                <TypeButton
                                    key={type}
                                    active={type === this.state.location}
                                    onPress={() => this.setState({location: type})}
                                >
                                    <TypeButtonText>{locationTypes[type].name}</TypeButtonText>
                                </TypeButton>
                            ))}
                        </TypeButtons>
                        {/*<Input*/}
                            {/*onChangeText={(location) => this.setState({location})}*/}
                            {/*value={this.state.location}*/}
                            {/*returnKeyType="next"*/}
                        {/*/>*/}
                        {/*<Label>Source</Label>*/}
                        {/*<Input*/}
                            {/*onChangeText={(source) => this.setState({source})}*/}
                            {/*value={this.state.source}*/}
                        {/*/>*/}

                        {/*<Input*/}
                            {/*onChangeText={(website) => this.setState({website})}*/}
                            {/*value={this.state.website}*/}
                        {/*/>*/}
                        {/*<TouchableOpacity onPress={() => this.fetchWebsite()}>*/}
                            {/*<Text>*/}
                                {/*Website*/}
                            {/*</Text>*/}
                        {/*</TouchableOpacity>*/}

                        <Label>Notes</Label>
                        <InputArea
                            multiline
                            onChangeText={(notes) => this.setState({notes})}
                            value={this.state.notes}
                            returnKeyType="next"
                        />

                        <TouchableOpacity onPress={() => this.addImage()}>
                            <Text>
                                Add Image
                            </Text>
                        </TouchableOpacity>

                        {!!this.state.image && (
                            <Image source={{uri: this.state.image}} style={{width: 300, height: 200}} />
                        )}

                        <TouchableOpacity onPress={() => this.addEntry()}>
                            <Text>
                                Add
                            </Text>
                        </TouchableOpacity>
                    </Wrap>
                </KeyboardAwareScrollView>
            </Container>
        )
    }
}

const Container = styled.View`
    flex: 1;
    background-color: ${colors.background};
`;

const Wrap = styled.View`
    padding: 40px 20px;
`;

const Input = styled.TextInput`
    height: 40px;
    background-color: ${colors.highlightBackground};
    border-radius: 5px;
    margin-bottom: 20px;
    color: black;
    padding: 0 10px;
`;

const InputArea = styled.TextInput`
    height: 80px;
    background-color: ${colors.highlightBackground};
    border-radius: 5px;
    margin-bottom: 20px;
    color: black;
    padding: 10px 10px;
`;

const Label = styled.Text`
    color: black;
    font-family: 'OpenSans-Bold';
    font-size: 12px;
    margin-bottom: 5px;
`;

const DinnerWithContainer = styled.View`
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
`;

const DinnerWith = styled.Text`
    color: black;
    font-family: 'OpenSans-Bold';
    font-size: 12px;
    margin-bottom: 10px;
`;

const AddBuddyButton = styled.TouchableOpacity`
    position: absolute;
    background-color: transparent;
    padding: 6px 15px;
    right: 0;
`;

const AddBuddyButtonText = styled.Text`
    font-family: 'OpenSans-Bold';
    color: black;
    font-size: 20px;
`;

const TagContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
`;

const Tag = styled.TouchableOpacity`
    background-color: ${colors.highlightBackground};
    border-radius: 20px;
    padding: 10px 20px;
    margin-right: 10px;
    margin-bottom: 10px;
`;

const TagText = styled.Text`;
    color: black;
    font-family: 'OpenSans-Bold';
    font-size: 12px;
`;

const TypeButtons = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
`;

const TypeButton = styled.TouchableOpacity`
    background-color: ${colors.highlightBackground};
    borderWidth: 2;
    borderColor: ${props => props.active ? colors.peach : colors.highlightBackground};
    border-radius: 20px;
    padding: 8px 18px;
    margin-right: 10px;
    margin-bottom: 10px;
`;

const TypeButtonText = styled.Text`
    color: black;
    font-family: 'OpenSans-Bold';
    font-size: 12px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(NewEntry);
