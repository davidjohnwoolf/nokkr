import axios from 'axios';

const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGIN = 'LOGIN';

const loginRequest = (credentials, callback) => {
    const request = axios.post('/login', credentials)
        .then(response => {
            callback(response);
        });
    
    return {
        type: LOGIN,
        payload: request
    };
}

const loginSuccess = (credentials, callback) => {
    const request = axios.post('/login', credentials)
        .then(response => {
            callback(response);
        });
    
    return {
        type: LOGIN,
        payload: request
    };
}

const loginFailure = (credentials, callback) => {
    const request = axios.post('/login', credentials)
        .then(response => {
            callback(response);
        });
    
    return {
        type: LOGIN,
        payload: request
    };
}

export const login = (credentials, callback) => {
    const request = axios.post('/login', credentials)
        .then(response => {
            callback(response);
        });
    
    return {
        type: LOGIN,
        payload: request
    };
}