import {
    FETCH_AREA,
    FETCH_AREAS_ALL,
    FETCH_AREAS_USER,
    CREATE_AREA_FAIL,
    CREATE_AREA_SUCCESS,
    UPDATE_AREA_FAIL,
    UPDATE_AREA_SUCCESS,
    DELETE_AREA,
    CLEAR_AREA
} from '../actions/areas.action';

export default function(state = {}, action) {

    switch (action.type) {
        case FETCH_AREA:
            return { ...state, area: action.area };
        
        case FETCH_AREAS_ALL:
            return { ...state, allAreas: action.allAreas };
            
        case FETCH_AREAS_USER:
            return { ...state, areas: action.areas };
        
        case CREATE_AREA_FAIL:
            return { ...state, fail: true, message: action.message };
        
        case CREATE_AREA_SUCCESS:
            return { ...state, success: true, message: action.message };
            
        case UPDATE_AREA_FAIL:
            return { ...state, fail: true, message: action.message };
        
        case UPDATE_AREA_SUCCESS:
            return { ...state, success: true, message: action.message };
            
        case DELETE_AREA:
            return { ...state, message: action.message };
            
        case CLEAR_AREA:
            return {};
            
        default:
            return state;
    }
}