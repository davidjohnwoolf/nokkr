//helper functions to construct common action creators
import { fetchList, fetchObject, createObject, updateObject, deleteObject, clearReducer } from './helpers';
import { LEAD_FIELD_PATH } from '../../lib/constants';

export const FETCH_LEAD_FIELDS = 'FETCH_LEAD_FIELDS';
export const FETCH_LEAD_FIELD = 'FETCH_LEAD_FIELD';
export const CREATE_LEAD_FIELD = 'CREATE_LEAD_FIELD';
export const UPDATE_LEAD_FIELD = 'UPDATE_LEAD_FIELD';
export const DELETE_LEAD_FIELD = 'DELETE_LEAD_FIELD';
export const CLEAR_LEAD_FIELDS = 'CLEAR_LEAD_FIELDS';

export const fetchLeadFields = () => {
    return fetchList({ url: LEAD_FIELD_PATH, type: FETCH_LEAD_FIELDS });
};

export const fetchLeadField = id => {
    return fetchObject({ url: LEAD_FIELD_PATH + id, type: FETCH_LEAD_FIELD });
};

export const createLeadField = leadField => {
    return createObject({ url: LEAD_FIELD_PATH, type: CREATE_LEAD_FIELD, body: leadField });
};

export const updateLeadField = (id, leadField) => {
    return updateObject({ url: LEAD_FIELD_PATH + id, type: UPDATE_LEAD_FIELD, body: leadField });
};

export const deleteLeadField = id => {
    return deleteObject({ url: LEAD_FIELD_PATH + id, type: DELETE_LEAD_FIELD });
};

export const clearLeadFields = () => {
    return clearReducer({ type: CLEAR_LEAD_FIELDS });
};