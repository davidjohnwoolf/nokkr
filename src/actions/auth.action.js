import axios from 'axios';
import jwtDecode from 'jwt-decode';

import { sendError } from './flash.action';

export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGIN = 'LOGIN';
export const CLEAR_AUTH = 'CLEAR_AUTH';

//status variables for Jsend API spec
import { SUCCESS, FAIL, ERROR } from '../../lib/constants';

export const login = creds => {
    
    return async dispatch => {
        const response = await axios.post('/login', creds);
        
        if (response.data.status === ERROR) dispatch(sendError(response.data.message));
        
        if (response.data.status === SUCCESS) {
            const decoded = jwtDecode(response.data.data.token);
                
            dispatch({
                type: LOGIN,
                token: response.data.data.token,
                role: decoded.role,
                isReadOnly: decoded.isReadOnly,
                sessionTeam: decoded.team,
                sessionId: decoded.id
            });
        }
        
        if (response.data.status === FAIL) {
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