import axios from 'axios';

import { sendError } from './flash.action';

//status variables for Jsend API spec
import { ERROR } from '../../lib/constants';

export const fetchList = ({ url, type }) => {
    
    return async dispatch => {
        const { data: res } = await axios.get(url);
        
        res.status === ERROR
            ? dispatch(sendError(res.message))
            : dispatch({ type, payload: res.data.payload });
    };
};

export const fetchObject = ({ url, type }) => {
    
    return async dispatch => {
        const { data: res } = await axios.get(url);
        
        res.status === ERROR
            ? dispatch(sendError(res.message))
            : dispatch({ type, payload: res.data.payload });
    };
};

export const createObject = ({ url, type, body }) => {
    
    return async dispatch => {
        const { data: res } = await axios.post(url, body);
        
        res.status === ERROR
            ? dispatch(sendError(res.message))
            : dispatch({ type, message: res.data.message, payload: res.data.payload });
    };
};

export const updateObject = ({ url, type, body }) => {
    
    return async dispatch => {
        const { data: res } = await axios.put(url, body);
        
        res.status === ERROR
            ? dispatch(sendError(res.message))
            : dispatch({ type, message: res.data.message });
    };
};

export const deleteObject = ({ url, type }) => {
    
    return async dispatch => {
        const { data: res } = await axios.delete(url);
        
        res.status === ERROR
            ? dispatch(sendError(res.message))
            : dispatch({ type, message: res.data.message });
    };
};

export const clearReducer = ({ type }) => {
    
    return dispatch => {
        dispatch({ type });
    };
};