import axios from 'axios';

import { sendError } from './flash.action';

export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_USER = 'FETCH_USER';
export const CREATE_USER = 'CREATE_USER';
export const UPDATE_USER = 'UPDATE_USER';
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

        if (response.data.status === SUCCESS) {
            dispatch({
                type: CREATE_USER,
                message: response.data.data.message,
                userId: response.data.data.id
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
                type: UPDATE_USER,
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