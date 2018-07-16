//helper functions to construct common action creators
import { fetchList, fetchObject, createObject, updateObject, deleteObject, clearReducer } from './helpers';
const { USER_PATH } = '../../lib/constants';

import { sendError } from './flash.action';

export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_USER = 'FETCH_USER';
export const CREATE_USER = 'CREATE_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const DELETE_USER = 'DELETE_USER';
export const CLEAR_USERS = 'CLEAR_USERS';

export const fetchUsers = () => {
    return fetchList({ url: USER_PATH, type: FETCH_USERS });
};

export const fetchUser = id => {
    return fetchObject({ url: USER_PATH + id, type: FETCH_USER });
};

export const createUser = user => {
    return createObject({ url: USER_PATH, type: CREATE_USER, body: user })
};

export const updateUser = (id, user) => {
    return updateObject({ url: USER_PATH + id, type: UPDATE_USER, body: user });
};

export const deleteUser = id => {
    return deleteObject({ url: USER_PATH + id, type: DELETE_USER });
};

export const clearUsers = () => {
    return clearReducer({ type: CLEAR_USERS });
};