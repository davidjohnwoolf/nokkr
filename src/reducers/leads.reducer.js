import {
    FETCH_LEAD,
    FETCH_LEADS,
    CREATE_LEAD,
    UPDATE_LEAD,
    DELETE_LEAD,
    CLEAR_LEADS,
    BULK_UPDATE_STATUS
} from '../actions/leads.action';

export default function(state = {}, action) {

    switch (action.type) {
        case FETCH_LEAD:
            return { ...state, lead: action.payload };
        
        case FETCH_LEADS:
            return { ...state, leads: action.payload };
        
        case CREATE_LEAD:
            return { ...state, success: true, created: true, message: action.message, leadId: action.payload };
        
        case UPDATE_LEAD:
            return { ...state, success: true, updated: true, message: action.message };
            
        case DELETE_LEAD:
            return { ...state, success: true, deleted: true, message: action.message };
            
        case CLEAR_LEADS:
            return { ...state, success: false, deleted: false, created: false, updated: false, message: '' };
            
        case BULK_UPDATE_STATUS:
            return { ...state, success: true, updated: true, message: action.message };
            
        default:
            return state;
    }
}