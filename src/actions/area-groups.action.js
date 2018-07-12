import axios from 'axios';

import { sendError } from './flash.action';

export const FETCH_AREA_GROUPS = 'FETCH_AREA_GROUPS';
export const FETCH_AREA_GROUP = 'FETCH_AREA_GROUP';
export const CREATE_AREA_GROUP = 'CREATE_AREA_GROUP';
export const UPDATE_AREA_GROUP = 'UPDATE_AREA_GROUP';
export const DELETE_AREA_GROUP = 'DELETE_AREA_GROUP';
export const CLEAR_AREA_GROUP = 'CLEAR_AREA_GROUP';

//status variables for Jsend API spec
import { SUCCESS, FAIL, ERROR } from '../../lib/constants';

export const fetchAreaGroups = () => {
    return async dispatch => {
        const response = await axios.get('/account/area-groups');
        
        if (response.data.status === ERROR) dispatch(sendError(response.data.message));

        dispatch({ type: FETCH_AREA_GROUPS, areaGroups: response.data.data.areaGroups });
    };
};

export const fetchAreaGroup = id => {
    return async dispatch => {
        const response = await axios.get(`/account/area-groups/${id}`);
        
        if (response.data.status === ERROR) dispatch(sendError(response.data.message));
        
        dispatch({ type: FETCH_AREA_GROUP, areaGroup: response.data.data.areaGroup });
    };
};

export const createAreaGroup = areaGroup => {
    
    return async dispatch => {
        const response = await axios.post('/account/area-groups', areaGroup);
        
        if (response.data.status === ERROR) dispatch(sendError(response.data.message));

        if (response.data.status === SUCCESS) {
            dispatch({
                type: CREATE_AREA_GROUP,
                message: response.data.data.message,
                areaGroupId: response.data.data.id
            });
        }
    };
};

export const updateAreaGroup = (id, areaGroup) => {
    
    return async dispatch => {
        const response = await axios.put(`/account/area-groups/${id}`, areaGroup);
        
        if (response.data.status === ERROR) dispatch(sendError(response.data.message));
        
        if (response.data.status === SUCCESS) {
            dispatch({
                type: UPDATE_AREA_GROUP,
                message: response.data.data.message
            });
        }
    };
};

export const deleteAreaGroup = id => {
    
    return async dispatch => {
        const response = await axios.delete(`/account/area-groups/${id}`);
        
        if (response.data.status === ERROR) dispatch(sendError(response.data.message));
        
        dispatch({ type: DELETE_AREA_GROUP, message: response.data.data.message });
    };
};

export const clearAreaGroup = () => {
    return dispatch => {
        dispatch({ type: CLEAR_AREA_GROUP });
    };
};