import axios from 'axios';

export const LOGIN = 'LOGIN';

// create user
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
