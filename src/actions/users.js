import axios from 'axios';
const ROOT_URL = 'https://2aef31351d4842269d972b6db3d4fed6.vfs.cloud9.us-west-2.amazonaws.com/user';

const FETCH_USER = 'FETCH_USER';

export function fetchUser(id) {
    const request = axios(`${ROOT_URL}/${id}`);
    
    return {
        type: FETCH_USER,
        payload: request
    };
}