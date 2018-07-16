//helper functions to construct common action creators
import { fetchList, fetchObject, createObject, updateObject, deleteObject, clearReducer } from './helpers';
import { AREA_GROUP_PATH } from '../../lib/constants';

export const FETCH_AREA_GROUPS = 'FETCH_AREA_GROUPS';
export const FETCH_AREA_GROUP = 'FETCH_AREA_GROUP';
export const CREATE_AREA_GROUP = 'CREATE_AREA_GROUP';
export const UPDATE_AREA_GROUP = 'UPDATE_AREA_GROUP';
export const DELETE_AREA_GROUP = 'DELETE_AREA_GROUP';
export const CLEAR_AREA_GROUPS = 'CLEAR_AREA_GROUPS';

export const fetchAreaGroups = () => {
    return fetchList({ url: AREA_GROUP_PATH, type: FETCH_AREA_GROUPS });
};

export const fetchAreaGroup = id => {
    return fetchObject({ url: AREA_GROUP_PATH + id, type: FETCH_AREA_GROUP });
};

export const createAreaGroup = user => {
    return createObject({ url: AREA_GROUP_PATH, type: CREATE_AREA_GROUP, body: user });
};

export const updateAreaGroup = (id, user) => {
    return updateObject({ url: AREA_GROUP_PATH + id, type: UPDATE_AREA_GROUP, body: user });
};

export const deleteAreaGroup = id => {
    return deleteObject({ url: AREA_GROUP_PATH + id, type: DELETE_AREA_GROUP });
};

export const clearAreaGroups = () => {
    return clearReducer({ type: CLEAR_AREA_GROUPS });
};