import axios from 'axios';

export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_USER = 'FETCH_USER';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_ERROR = 'CREATE_USER_ERROR';

export const fetchUsers = () => {
    const request = axios.get('/users');
    
    return dispatch => {
        request.then(res => dispatch({ type: FETCH_USERS, payload: res }));
    }
};

export const fetchUser = (id) => {
    const request = axios.get(`/users/${id}`);
    
    return dispatch => {
        request.then(res => dispatch({ type: FETCH_USER, payload: res }));
    }
};

export const createUser = (user) => {
    const request = axios.post('/users', user);
    
    return dispatch => {
        request.then(res => {
            if (res.data.error) return dispatch({ type: CREATE_USER_ERROR, error: res.data.error });
            
            if (res.data.message) return dispatch({ type: CREATE_USER_SUCCESS, message: res.data.message });
        });
    }
};