import {
    FETCH_AREA_GROUP,
    FETCH_AREA_GROUPS,
    CREATE_AREA_GROUP,
    UPDATE_AREA_GROUP,
    DELETE_AREA_GROUP,
    CLEAR_AREA_GROUP
} from '../actions/area-groups.action';

export default function(state = {}, action) {

    switch (action.type) {
        case FETCH_AREA_GROUP:
            return { ...state, areaGroup: action.areaGroup };
        
        case FETCH_AREA_GROUPS:
            return { ...state, areaGroups: action.areaGroups };
        
        case CREATE_AREA_GROUP:
            return { ...state, success: true, message: action.message, areaGroupId: action.areaGroupId };
        
        case UPDATE_AREA_GROUP:
            return { ...state, success: true, message: action.message };
            
        case DELETE_AREA_GROUP:
            return { ...state, success: true, user: null, message: action.message };
            
        case CLEAR_AREA_GROUP:
            return {};
            
        default:
            return state;
    }
}