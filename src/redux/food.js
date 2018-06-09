// @flow
import firebase from 'react-native-firebase';

// state def

export type FoodState = {
    entries: Array<{
        name: string,
        description: string,
        buddies: Array<{name: string}>
    }>
};

const defaultState: FoodState = {
    entries: []
};

export type Action =
    {type: 'ADD_ENTRY', payload: Object}

// actions

// reducer

export default (state: FoodState = defaultState, action: Action) => {
    switch (action.type) {
        case 'GET_MEALS': {
            return {
                ...state,
                entries: [...action.payload]
            }
        }
        case 'ADD_ENTRY': {
            return {
                ...state,
                entries: [action.payload ,...state.entries]
            }
        }
        default:
            return state
    }
}

// action creators

export const getMeals = () => (dispatch) => {
    let meals = [];
    firebase.firestore().collection('meals').orderBy('date', 'desc').get().then((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
            meals.push(doc.data());
        });
        dispatch({type: 'GET_MEALS', payload: meals})
    })
};

export const createNewEntry = (entry: Object) => (dispatch) => {
    firebase.firestore().collection('meals').add(entry).then((docRef) => {
        dispatch({
            type: 'ADD_ENTRY',
            payload: {
                id: docRef.id,
                ...entry
            }
        });
    })
};
