// @flow

import firebase from 'react-native-firebase';

// state def


export type BuddiesState = {
    buddies: {
        [string]: {
            name: string
        }
    }
};

const defaultState: BuddiesState = [];

export type Action =
    {type: 'ADD_BUDDY', payload: Object}

// actions

// reducer

export default (state: BuddiesState = defaultState, action: Action) => {
    switch (action.type) {
        case 'GET_BUDDIES': {
            return {
                ...state,
                buddies: action.payload
            }
        }
        case 'ADD_BUDDY': {
            return {
                ...state,
                buddies: {
                    ...action.payload,
                    ...state.buddies
                }


            }
        }
        default:
            return state
    }
}

// action creators

export const getBuddies = () => (dispatch) => {
    let buddies = {};
    firebase.firestore().collection('buddies').get().then((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
            buddies[doc.id] = doc.data();
        });
        dispatch({type: 'GET_BUDDIES', payload: buddies})
    })
};

export const addBuddy = (buddy: string) => (dispatch) => {
    firebase.firestore().collection('buddies').add({
        name: buddy,
    }).then((docRef) => {
        dispatch({
            type: 'ADD_BUDDY',
            payload: {
                [docRef.id]: {
                    name: buddy
                }
            }
        });
    })
};
