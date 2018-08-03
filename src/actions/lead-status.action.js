//helper functions to construct common action creators
import { fetchList, fetchObject, createObject, updateObject, deleteObject, clearReducer } from './helpers';
import { LEAD_STATUS_PATH } from '../../lib/constants';

export const FETCH_LEAD_STATUSES = 'FETCH_LEAD_STATUSES';
export const FETCH_LEAD_STATUS = 'FETCH_LEAD_STATUS';
export const CREATE_LEAD_STATUS = 'CREATE_LEAD_STATUS';
export const UPDATE_LEAD_STATUS = 'UPDATE_LEAD_STATUS';
export const DELETE_LEAD_STATUS = 'DELETE_LEAD_STATUS';
export const CLEAR_LEAD_STATUSES = 'CLEAR_LEAD_STATUSES';

export const fetchLeadStatuses = () => {
    return fetchList({ url: LEAD_STATUS_PATH, type: FETCH_LEAD_STATUSES });
};

export const fetchLeadStatus = id => {
    return fetchObject({ url: LEAD_STATUS_PATH + id, type: FETCH_LEAD_STATUS });
};

export const createLeadStatus = leadStatus => {
    return createObject({ url: LEAD_STATUS_PATH, type: CREATE_LEAD_STATUS, body: leadStatus });
};

export const updateLeadStatus = (id, leadStatus) => {
    return updateObject({ url: LEAD_STATUS_PATH + id, type: UPDATE_LEAD_STATUS, body: leadStatus });
};

export const deleteLeadStatus = id => {
    return deleteObject({ url: LEAD_STATUS_PATH + id, type: DELETE_LEAD_STATUS });
};

export const clearLeadStatuses = () => {
    return clearReducer({ type: CLEAR_LEAD_STATUSES });
};