import axios from 'axios';
import jwtDecode from 'jwt-decode';

export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const AUTHENTICATED = 'AUTHENTICATED';
export const UNAUTHENTICATED = 'UNAUTHENTICATED';
export const CLEAR_AUTH_MESSAGES = 'CLEAR_AUTH_MESSAGES';

export const login = creds => {
    const request = axios.post('/login', creds);
    
    return dispatch => {
        request.then(res => {
            if (res.data.error) {

                dispatch({
                    type: LOGIN_ERROR,
                    serverError: res.data.error
                });
            }
            if (res.data.token) {
                const decoded = jwtDecode(res.data.token);
                
                dispatch({
                    type: LOGIN_SUCCESS,
                    token: res.data.token,
                    id: decoded.id,
                    successMessage: res.data.message
                });
            }
        });
    };
};

export const logout = () => {
    //eventually sent to server to revoke token and get back response
    return dispatch => {
        dispatch({ type: UNAUTHENTICATED });
    }
}

export const clearAuthMessages = () => {
    return dispatch => {
        dispatch({ type: CLEAR_AUTH_MESSAGES });
    };
};