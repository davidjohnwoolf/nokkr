import axios from 'axios';

export const FETCH_USER = 'FETCH_USER';
export const FETCH_USERS = 'FETCH_USERS';
export const CREATE_USER = 'CREATE_USER';
//export const CREATE_USER_ERROR = 'CREATE_USER_ERROR';

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

// create user
export const createUser = (user, callback) => {
    const request = axios.post('/user', user)
        .then(response => {
            callback(response);
        });
    
    return {
        type: CREATE_USER,
        payload: request
    };
}

