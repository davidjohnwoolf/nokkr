import axios from 'axios';

export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_USER = 'FETCH_USER';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAIL = 'CREATE_USER_ERROR';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAIL = 'UPDATE_USER_FAIL';
export const DELETE_USER = 'DELETE_USER';
export const CLEAR_USER = 'CLEAR_USER';

export const fetchUsers = () => {
    return async dispatch => {
        const response = await axios.get('/users');
        
        dispatch({ type: FETCH_USERS, users: response.data.data.users });
    };
};

export const fetchUser = id => {
    return async dispatch => {
        const response = await axios.get(`/users/${id}`);
        
        dispatch({ type: FETCH_USER, user: response.data.data.user });
    };
};

export const createUser = user => {
    
    return async dispatch => {
        const response = await axios.post('/users', user);
        
        if (response.data.status === 'success') {
            dispatch({
                type: CREATE_USER_SUCCESS,
                message: response.data.data.message
            });
        }
        
        if (response.data.status === 'fail') {
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
        
        if (response.data.status === 'success') {
            dispatch({
                type: UPDATE_USER_SUCCESS,
                message: response.data.data.message
            });
        }
        
        if (response.data.status === 'fail') {
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
        
        dispatch({ type: DELETE_USER, message: response.data.data.message });
    };
};

export const clearUser = user => {
    return dispatch => {
        dispatch({ type: CLEAR_USER });
    };
};