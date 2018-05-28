import axios from 'axios';

export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export const login = (creds) => {
    const request = axios.post('/login', creds);
    
    return dispatch => {
        request.then(res => {
            if (res.data.error) {
                //return needed here?
                dispatch({
                    type: LOGIN_ERROR,
                    serverError: res.data.error
                })
            }
            if (res.data.token) {
                //return needed here?
                dispatch({
                    type: LOGIN_SUCCESS,
                    token: res.data.token
                })
            }
        });
    }
}