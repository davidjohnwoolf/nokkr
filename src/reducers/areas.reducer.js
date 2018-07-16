import {
    FETCH_AREAS,
    FETCH_AREA,
    CREATE_AREA,
    UPDATE_AREA,
    DELETE_AREA,
    CLEAR_AREAS
} from '../actions/areas.action';

export default function(state = {}, action) {

    switch (action.type) {
        
        case FETCH_AREAS:
            return { ...state, areas: action.payload };
            
        case FETCH_AREA:
            return { ...state, area: action.area };
        
        case CREATE_AREA:
            return { ...state, success: true, message: action.message, areaId: action.payload };

        case UPDATE_AREA:
            return { ...state, success: true, message: action.message };
            
        case DELETE_AREA:
            return { ...state, success: true, deleted: true, message: action.message };
            
        case CLEAR_AREAS:
            return {};
            
        default:
            return state;
    }
}