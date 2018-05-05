import axios from 'axios';

export const FETCH_USERS = 'FETCH_USERS';

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