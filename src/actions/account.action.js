//helper functions to construct common action creators
import { fetchObject, updateObject, clearReducer } from './helpers';
import { ACCOUNT_PATH } from '../../lib/constants';

export const FETCH_ACCOUNT = 'FETCH_ACCOUNT';
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
export const CLEAR_ACCOUNTS = 'CLEAR_ACCOUNT';

export const fetchAccount = () => {
    return fetchObject({ url: ACCOUNT_PATH, type: FETCH_ACCOUNT });
};

export const updateAccount = (id, account) => {
    return updateObject({ url: ACCOUNT_PATH + id, type: UPDATE_ACCOUNT, body: account });
};

export const clearAccount = () => {
    return clearReducer({ type: CLEAR_ACCOUNTS });
};