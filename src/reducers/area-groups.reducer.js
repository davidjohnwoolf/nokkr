import {
    FETCH_AREA_GROUP,
    FETCH_AREA_GROUPS,
    CREATE_AREA_GROUP,
    UPDATE_AREA_GROUP,
    DELETE_AREA_GROUP,
    CLEAR_AREA_GROUPS
} from '../actions/area-groups.action';

export default function(state = {}, action) {

    switch (action.type) {
        case FETCH_AREA_GROUP:
            return { ...state, areaGroup: action.payload };
        
        case FETCH_AREA_GROUPS:
            return { ...state, areaGroups: action.payload };
        
        case CREATE_AREA_GROUP:
            return { ...state, success: true, message: action.message, areaGroupId: action.payload };
        
        case UPDATE_AREA_GROUP:
            return { ...state, success: true, message: action.message };
            
        case DELETE_AREA_GROUP:
            return { ...state, success: true, deleted: true, message: action.message };
            
        case CLEAR_AREA_GROUPS:
            return { ...state, success: false, deleted: false, message: '' };
            
        default:
            return state;
    }
}