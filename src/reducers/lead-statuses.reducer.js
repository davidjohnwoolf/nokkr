import {
    FETCH_LEAD_STATUS,
    FETCH_LEAD_STATUSES,
    CREATE_LEAD_STATUS,
    UPDATE_LEAD_STATUS,
    DELETE_LEAD_STATUS,
    CLEAR_LEAD_STATUSES
} from '../actions/lead-statuses.action';

export default function(state = {}, action) {

    switch (action.type) {
        case FETCH_LEAD_STATUS:
            return { ...state, leadStatus: action.payload };
        
        case FETCH_LEAD_STATUSES:
            return { ...state, leadStatuses: action.payload };
        
        case CREATE_LEAD_STATUS:
            return { ...state, success: true, created: true, message: action.message, leadStatusId: action.payload };
        
        case UPDATE_LEAD_STATUS:
            return { ...state, success: true, updated: true, message: action.message };
            
        case DELETE_LEAD_STATUS:
            return { ...state, success: true, deleted: true, message: action.message };
            
        case CLEAR_LEAD_STATUSES:
            return { ...state, success: false, deleted: false, created: false, updated: false, message: '' };
            
        default:
            return state;
    }
}