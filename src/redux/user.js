// @flow
import firebase from 'react-native-firebase';

// state def

export type UserState = {
    user: Object,
    loggedIn: boolean,
    errorRegister?: Object,
    errorLogin?: Object
};

const defaultState: UserState = {
    user: {},
    loggedIn: false,
    errorRegister: undefined,
    errorLogin: undefined
};

export type Action =
    {type: 'SET_USER', payload: Object}

// actions

// reducer

export default (state: UserState = defaultState, action: Action) => {
    switch (action.type) {
        case 'SET_USER': {
            return {
                ...state,
                ...action.payload,
                loggedIn: true,
                errorRegister: undefined,
                errorLogin: undefined
            }
        }
        case 'REGISTER_ERROR': {
            return {
                ...state,
                errorRegister: {...action.payload.error},
                loggedIn: false
            }
        }
        case 'LOGIN_ERROR': {
            return {
                ...state,
                errorLogin: {...action.payload.error},
                loggedIn: false
            }
        }
        default:
            return state
    }
}

// action creators

export const registerUser = (email, password) => (dispatch) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(response => {
            dispatch({
                type: 'SET_USER',
                payload: {
                    user: response.toJSON()
                }
            })
        })
        .catch(error => {
            switch (error.code) {
                case 'auth/email-already-in-use': {
                    dispatch({
                        type: 'REGISTER_ERROR',
                        payload: {
                            error: {
                                code: error.code,
                                type: 'general',
                                message: 'An account with this email already exists. You can go on to login!'
                            }
                        }
                    });
                    break;
                }
                case 'auth/invalid-email': {
                    dispatch({
                        type: 'REGISTER_ERROR',
                        payload: {
                            error: {
                                code: error.code,
                                type: 'email',
                                message: 'This is not a valid email address'
                            }
                        }
                    });
                    break;
                }
                case 'auth/weak-password': {
                    dispatch({
                        type: 'REGISTER_ERROR',
                        payload: {
                            error: {
                                code: error.code,
                                type: 'password',
                                message: 'The password must be 6 characters long or more'
                            }
                        }
                    });
                    break;
                }
                default: {
                    dispatch({
                        type: 'REGISTER_ERROR',
                        payload: {
                            code: error.code,
                            type: 'email',
                            message: 'Something went wrong, try again'
                        }
                    })
                }
            }

        })
}

export const loginUser = (email, password) => (dispatch) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(response => {
            dispatch({
                type: 'SET_USER',
                payload: {
                    user: response.toJSON()
                }
            })
        })
        .catch(error => {
            switch (error.code) {
                case 'auth/user-not-found': {
                    dispatch({
                        type: 'LOGIN_ERROR',
                        payload: {
                            error: {
                                code: error.code,
                                type: 'general',
                                message: 'We can\'t find an account with this email. Register a new account or try another email'
                            }
                        }
                    });
                    break;
                }
                case 'auth/invalid-email': {
                    dispatch({
                        type: 'LOGIN_ERROR',
                        payload: {
                            error: {
                                code: error.code,
                                type: 'email',
                                message: 'This is not a valid email address'
                            }
                        }
                    });
                    break;
                }
                case 'auth/wrong-password': {
                    dispatch({
                        type: 'LOGIN_ERROR',
                        payload: {
                            error: {
                                code: error.code,
                                type: 'password',
                                message: 'This is not the right password, it must be that other one'
                            }
                        }
                    });
                    break;
                }
                default: {
                    dispatch({
                        type: 'LOGIN_ERROR',
                        payload: {
                            code: error.code,
                            type: 'email',
                            message: 'Something went wrong, try again'
                        }
                    })
                }
            }
        })
};

export const requestPasswordReset = (email) => (dispatch) => {
    firebase.auth().sendPasswordResetEmail(email);
};

export const logout = () => (dispatch) => {
    firebase.auth().signOut();
    dispatch({type: 'LOGOUT'});
};
