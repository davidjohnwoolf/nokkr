import axios from 'axios';

import { sendError } from './flash.action';

export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_USER = 'FETCH_USER';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAIL = 'CREATE_USER_FAIL';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAIL = 'UPDATE_USER_FAIL';
export const DELETE_USER = 'DELETE_USER';
export const CLEAR_USER = 'CLEAR_USER';

//status variables for Jsend API spec
import { SUCCESS, FAIL, ERROR } from '../../lib/constants';

export const fetchUsers = () => {
    return async dispatch => {
        const response = await axios.get('/users');
        
        if (response.data.status === ERROR) dispatch(sendError(response.data.message));
        
        dispatch({ type: FETCH_USERS, users: response.data.data.users });
    };
};

export const fetchUser = id => {
    return async dispatch => {
        const response = await axios.get(`/users/${id}`);
        
        if (response.data.status === ERROR) dispatch(sendError(response.data.message));
        
        dispatch({ type: FETCH_USER, user: response.data.data.user });
    };
};

export const createUser = user => {
    
    return async dispatch => {
        const response = await axios.post('/users', user);
        
        if (response.data.status === ERROR) dispatch(sendError(response.data.message));

        //add the constants for these
        if (response.data.status === SUCCESS) {
            dispatch({
                type: CREATE_USER_SUCCESS,
                message: response.data.data.message
            });
        }
        
        if (response.data.status === FAIL) {
            dispatch({
                type: CREATE_USER_FAIL,
                message: response.data.data.message
            });
        }
    };
};

export const updateUser = (id, user) => {
    
    return async dispatch => {
        const response = await axios.put(`/users/${id}`, user);
        
        if (response.data.status === ERROR) dispatch(sendError(response.data.message));
        
        if (response.data.status === SUCCESS) {
            dispatch({
                type: UPDATE_USER_SUCCESS,
                message: response.data.data.message
            });
        }
        
        if (response.data.status === FAIL) {
            dispatch({
                type: UPDATE_USER_FAIL,
                message: response.data.data.message
            });
        }
    };
};

export const deleteUser = id => {
    
    return async dispatch => {
        const response = await axios.delete(`/users/${id}`);
        
        if (response.data.status === ERROR) dispatch(sendError(response.data.message));
        
        dispatch({ type: DELETE_USER, message: response.data.data.message });
    };
};

export const clearUser = () => {
    return dispatch => {
        dispatch({ type: CLEAR_USER });
    };
};