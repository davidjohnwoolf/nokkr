import axios from 'axios';

export const FETCH_USER = 'FETCH_USER';
export const FETCH_USERS = 'FETCH_USERS';

// fetch list of users
export const fetchUsers = () => {
    const request = axios.get('/user');
    
    return {
        type: FETCH_USERS,
        payload: request
    };
}

// fetch user by id
export const fetchUser = id => {
    const request = axios.get(`/user/${id}`);
    
    return {
        type: FETCH_USER,
        payload: request
    };
}

