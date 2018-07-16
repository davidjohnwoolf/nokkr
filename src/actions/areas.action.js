//helper functions to construct common action creators
import { fetchList, fetchObject, createObject, updateObject, deleteObject, clearReducer } from './helpers';
import { AREA_PATH } from '../../lib/constants';

export const FETCH_AREAS = 'FETCH_AREAS';
export const FETCH_AREA = 'FETCH_AREA';
export const CREATE_AREA = 'CREATE_AREA';
export const UPDATE_AREA = 'UPDATE_AREA';
export const DELETE_AREA = 'DELETE_AREA';
export const CLEAR_AREAS = 'CLEAR_AREA';

export const fetchAreas = () => {
    return fetchList({ url: AREA_PATH, type: FETCH_AREAS });
};

export const fetchArea = id => {
    return fetchObject({ url: AREA_PATH + id, type: FETCH_AREA });
};

export const createArea = user => {
    return createObject({ url: AREA_PATH, type: CREATE_AREA, body: user });
};

export const updateArea = (id, user) => {
    return updateObject({ url: AREA_PATH + id, type: UPDATE_AREA, body: user });
};

export const deleteArea = id => {
    return deleteObject({ url: AREA_PATH + id, type: DELETE_AREA });
};

export const clearAreas = () => {
    return clearReducer({ type: CLEAR_AREAS });
};