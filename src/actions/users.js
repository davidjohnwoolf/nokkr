import axios from 'axios';

export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_USER = 'FETCH_USER';

export const fetchUsers = () => {
    const request = axios.get('/users');
    
    return (dispatch) => {
        request.then(data => {
            dispatch({
                type: FETCH_USERS,
                payload: data
            });
        });
    }
};

export const fetchUser = (id) => {
    const request = axios.get(`/users/${id}`);
    
    return (dispatch) => {
        request.then(data => {
            dispatch({
                type: FETCH_USER,
                payload: data
            });
        });
    }
};