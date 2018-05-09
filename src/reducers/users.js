import { FETCH_USER, FETCH_USERS, CREATE_USER_ERROR, CREATE_USER_SUCCESS } from '../actions/users';

export default function(state = {}, action) {

    switch (action.type) {
        case FETCH_USER:
            return { ...state, user: action.payload.data };
        
        case FETCH_USERS:
            return { ...state, users: action.payload.data };
        
        case CREATE_USER_ERROR:
            return { ...state, error: action.error };
        
        case CREATE_USER_SUCCESS:
            return { ...state, message: action.message };
            
        default:
            return state;
    }
}