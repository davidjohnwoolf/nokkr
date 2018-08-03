//helper functions to construct common action creators
import { fetchList, fetchObject, createObject, updateObject, deleteObject, clearReducer } from './helpers';
import { LEAD_PATH } from '../../lib/constants';

export const FETCH_LEADS = 'FETCH_LEADS';
export const FETCH_LEAD = 'FETCH_LEAD';
export const CREATE_LEAD = 'CREATE_LEAD';
export const UPDATE_LEAD = 'UPDATE_LEAD';
export const DELETE_LEAD = 'DELETE_LEAD';
export const CLEAR_LEADS = 'CLEAR_LEADS';

export const fetchLeads = () => {
    return fetchList({ url: LEAD_PATH, type: FETCH_LEADS });
};

export const fetchLead = id => {
    return fetchObject({ url: LEAD_PATH + id, type: FETCH_LEAD });
};

export const createLead = lead => {
    return createObject({ url: LEAD_PATH, type: CREATE_LEAD, body: lead });
};

export const updateLead = (id, lead) => {
    return updateObject({ url: LEAD_PATH + id, type: UPDATE_LEAD, body: lead });
};

export const deleteLead = id => {
    return deleteObject({ url: LEAD_PATH + id, type: DELETE_LEAD });
};

export const clearLeads = () => {
    return clearReducer({ type: CLEAR_LEADS });
};