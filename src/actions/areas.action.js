import axios from 'axios';

export const FETCH_AREAS_ALL = 'FETCH_AREAS_ALL';
export const FETCH_AREAS_USER = 'FETCH_AREAS_USER';
export const FETCH_AREA = 'FETCH_AREA';
export const CREATE_AREA_SUCCESS = 'CREATE_AREA_SUCCESS';
export const CREATE_AREA_FAIL = 'CREATE_AREA_FAIL';
export const UPDATE_AREA_SUCCESS = 'UPDATE_AREA_SUCCESS';
export const UPDATE_AREA_FAIL = 'UPDATE_AREA_FAIL';
export const DELETE_AREA = 'DELETE_AREA';
export const CLEAR_AREA = 'CLEAR_AREA';

export const fetchAreasAll = () => {
    return async dispatch => {
        const response = await axios.get('/areas');
        
        dispatch({ type: FETCH_AREAS_ALL, allAreas: response.data.data.allAreas });
    };
};

export const fetchAreasUser = id => {
    return async dispatch => {
        const response = await axios.get(`/users/${ id }/areas`);
        
        dispatch({ type: FETCH_AREAS_USER, areas: response.data.data.areas });
    };
};

export const fetchArea = (userId, areaId) => {
    return async dispatch => {
        const response = await axios.get(`/users/${ userId }/areas/${ areaId }`);
        
        dispatch({ type: FETCH_AREA, area: response.data.data.area });
    };
};

export const createArea = area => {
    return async dispatch => {
        const response = await axios.post('/areas', area);
        
        if (response.data.status === 'success') {
            dispatch({
                type: CREATE_AREA_SUCCESS,
                message: response.data.data.message
            });
        }
        
        if (response.data.status === 'fail') {
            dispatch({
                type: CREATE_AREA_FAIL,
                message: response.data.data.message
            });
        }
    };
};

export const updateArea = (userId, areaId, area) => {
    return async dispatch => {
        const response = await axios.put(`/users/${ userId }/areas/${ areaId }`, area);
        
        if (response.data.status === 'success') {
            dispatch({
                type: UPDATE_AREA_SUCCESS,
                message: response.data.data.message
            });
        }
        
        if (response.data.status === 'fail') {
            dispatch({
                type: UPDATE_AREA_FAIL,
                message: response.data.data.message
            });
        }
    };
};

export const deleteArea = (userId, areaId) => {
    return async dispatch => {
        const response = await axios.delete(`/users/${ userId }/areas/${ areaId }`);
        
        dispatch({ type: DELETE_AREA, message: response.data.data.message });
    };
};

export const clearArea = () => {
    return dispatch => {
        dispatch({ type: CLEAR_AREA });
    };
};