import {
    FETCH_USER,
    FETCH_USERS,
    CREATE_USER_FAIL,
    CREATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    UPDATE_USER_SUCCESS,
    DELETE_USER,
    CLEAR_USER
} from '../actions/users.action';

export default function(state = {}, action) {

    switch (action.type) {
        case FETCH_USER:
            return { ...state, user: action.user, isFetching: false };
        
        case FETCH_USERS:
            return { ...state, users: action.users, isFetching: false };
        
        case CREATE_USER_FAIL:
            return { ...state, fail: true, message: action.message };
        
        case CREATE_USER_SUCCESS:
            return { ...state, success: true, message: action.message, userId: action.userId };
            
        case UPDATE_USER_FAIL:
            return { ...state, fail: true, message: action.message };
        
        case UPDATE_USER_SUCCESS:
            return { ...state, success: true, message: action.message };
            
        case DELETE_USER:
            return { ...state, success: true, user: null, message: action.message };
            
        case CLEAR_USER:
            return {};
            
        default:
            return state;
    }
}