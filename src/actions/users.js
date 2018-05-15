import axios from 'axios';

export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_USER = 'FETCH_USER';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_ERROR = 'CREATE_USER_ERROR';
export const CLEAR_USER_MESSAGES = 'CLEAR_USER_MESSAGES';

export const fetchUsers = () => {
    const request = axios.get('/users');
    
    return dispatch => {
        request.then(res => dispatch({ type: FETCH_USERS, payload: res }));
    }
};

export const fetchUser = id => {
    const request = axios.get(`/users/${id}`);
    
    return dispatch => {
        request.then(res => dispatch({ type: FETCH_USER, payload: res }));
    }
};

export const clearUserMessages = user => {
    return dispatch => {
        dispatch({ type: CLEAR_USER_MESSAGES });
    }
};

export const createUser = user => {
    //maybe use async await and fetch
    const request = axios.post('/users', user);
    
    return dispatch => {
        request.then(res => {

            if (res.data.error) {
                dispatch({
                    type: CREATE_USER_ERROR,
                    serverError: res.data.error
                });
            }
            
            if (res.data.message) {
                dispatch({
                    type: CREATE_USER_SUCCESS,
                    successMessage: res.data.message
                });
            }
        });
    }
};