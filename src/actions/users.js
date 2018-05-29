import axios from 'axios';

export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_USER = 'FETCH_USER';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_ERROR = 'CREATE_USER_ERROR';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_ERROR = 'UPDATE_USER_ERROR';
export const DELETE_USER = 'DELETE_USER';
export const CLEAR_USER_MESSAGES = 'CLEAR_USER_MESSAGES';

//why are you getting the console error when not using those methods?

export const fetchUsers = () => {
    const request = axios.get('/users');
    
    return dispatch => {
        request.then(res => dispatch({ type: FETCH_USERS, users: res.data }));
    };
};

export const fetchUser = id => {
    const request = axios.get(`/users/${id}`);
    
    return dispatch => {
        request.then(res => dispatch({ type: FETCH_USER, user: res.data }));
    };
};

export const clearUserMessages = user => {
    return dispatch => {
        dispatch({ type: CLEAR_USER_MESSAGES });
    };
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
    };
};

export const updateUser = (id, user) => {
    //maybe use async await and fetch
    //is it bad you are using the same variables for user edit and user create?
    const request = axios.put(`/users/${id}`, user);
    
    return dispatch => {
        request.then(res => {

            if (res.data.error) {
                dispatch({
                    type: UPDATE_USER_ERROR,
                    serverError: res.data.error
                });
            }
            
            if (res.data.message) {
                dispatch({
                    type: UPDATE_USER_SUCCESS,
                    successMessage: res.data.message
                });
            }
        });
    };
};

export const deleteUser = id => {
    const request = axios.delete(`/users/${id}`);
    
    return dispatch => {
        request.then(res => dispatch({ type: DELETE_USER, successMessage: res.data.message }));
    };
};