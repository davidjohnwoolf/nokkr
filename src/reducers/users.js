import {
    FETCH_USER,
    FETCH_USERS,
    CREATE_USER_ERROR,
    CREATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    UPDATE_USER_SUCCESS,
    DELETE_USER,
    CLEAR_USER_MESSAGES
} from '../actions/users';

export default function(state = {}, action) {

    switch (action.type) {
        case FETCH_USER:
            //maybe rename payload to something like user
            return { ...state, user: action.payload.data };
        
        case FETCH_USERS:
            //maybe rename payload to something like user
            return { ...state, users: action.payload.data };
        
        case CREATE_USER_ERROR:
            return { ...state, serverError: action.serverError };
        
        case CREATE_USER_SUCCESS:
            return { ...state, successMessage: action.successMessage };
            
        case UPDATE_USER_ERROR:
            return { ...state, serverError: action.serverError };
        
        case UPDATE_USER_SUCCESS:
            return { ...state, successMessage: action.successMessage };
            
        case DELETE_USER:
            return { ...state, successMessage: action.successMessage };
            
        case CLEAR_USER_MESSAGES:
            return { ...state, successMessage: '', serverError: '' };
            
        default:
            return state;
    }
}