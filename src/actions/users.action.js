import axios from 'axios';
const ROOT_URL = 'https://2aef31351d4842269d972b6db3d4fed6.vfs.cloud9.us-west-2.amazonaws.com/user';

const FETCH_USER = 'FETCH_USER';

export const fetchUser = id => {
    const request = axios.get(`/user/${id}`);
    
    return {
        type: 'FETCH_USER',
        payload: request
    };
}