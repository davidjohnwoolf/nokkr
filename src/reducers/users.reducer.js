import {
    FETCH_USER,
    FETCH_USERS,
    CREATE_USER,
    UPDATE_USER,
    DELETE_USER,
    CLEAR_USERS
} from '../actions/users.action';

export default function(state = {}, action) {

    switch (action.type) {
        case FETCH_USER:
            return { ...state, user: action.payload };
        
        case FETCH_USERS:
            return { ...state, users: action.payload };
        
        case CREATE_USER:
            return { ...state, success: true, message: action.message, userId: action.payload };
        
        case UPDATE_USER:
            return { ...state, success: true, message: action.message };
            
        case DELETE_USER:
            return { ...state, success: true, user: null, message: action.message };
            
        case CLEAR_USERS:
            return {};
            
        default:
            return state;
    }
}