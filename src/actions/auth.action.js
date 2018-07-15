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
        const { data: res } = await axios.post('/login', creds);
        
        if (res.status === ERROR) dispatch(sendError(res.message));
        
        if (res.status === SUCCESS) {
            const decoded = jwtDecode(res.data.token);
                
            dispatch({
                type: LOGIN,
                token: res.data.token,
                role: decoded.role,
                isReadOnly: decoded.isReadOnly,
                sessionTeam: decoded.team,
                sessionId: decoded.id
            });
        }
        
        if (res.status === FAIL) {
            dispatch({
                type: LOGIN_FAIL,
                message: res.data.message
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