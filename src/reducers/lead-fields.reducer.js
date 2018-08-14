import {
    FETCH_LEAD_FIELD,
    FETCH_LEAD_FIELDS,
    CREATE_LEAD_FIELD,
    UPDATE_LEAD_FIELD,
    DELETE_LEAD_FIELD,
    CLEAR_LEAD_FIELDS
} from '../actions/lead-fields.action';

export default function(state = {}, action) {

    switch (action.type) {
        case FETCH_LEAD_FIELD:
            return { ...state, leadField: action.payload };
        
        case FETCH_LEAD_FIELDS:
            return { ...state, leadFields: action.payload };
        
        case CREATE_LEAD_FIELD:
            return { ...state, success: true, created: true, message: action.message, leadFieldId: action.payload };
        
        case UPDATE_LEAD_FIELD:
            return { ...state, success: true, updated: true, message: action.message };
            
        case DELETE_LEAD_FIELD:
            return { ...state, success: true, deleted: true, message: action.message };
            
        case CLEAR_LEAD_FIELDS:
            return { ...state, success: false, deleted: false, created: false, updated: false, message: '' };
            
        default:
            return state;
    }
}