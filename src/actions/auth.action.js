import axios from 'axios';
import jwtDecode from 'jwt-decode';

export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const CLEAR_AUTH = 'CLEAR_AUTH';

export const login = creds => {
    
    return async dispatch => {
        const response = await axios.post('/login', creds);
        
        if (response.data.status === 'success') {
            const decoded = jwtDecode(response.data.data.token);
                
            dispatch({
                type: LOGIN_SUCCESS,
                token: response.data.data.token,
                id: decoded.id
            });
        }
        
        if (response.data.status === 'fail') {
            dispatch({
                type: LOGIN_FAIL,
                message: response.data.data.message
            });
        }
    };
};

export const logout = () => {
    //eventually sent to server to revoke token and get back response
    //for now just using clear auth
    return dispatch => {
        dispatch({ type: CLEAR_AUTH });
    };
};

export const clearAuth = () => {
    return dispatch => {
        dispatch({ type: CLEAR_AUTH });
    };
};