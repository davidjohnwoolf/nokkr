import { FETCH_USER, FETCH_USERS, CREATE_USER } from '../actions/users.action';

export default function(state = {}, action) {

    switch (action.type) {
        case FETCH_USER:
            return { ...state, user: action.payload.data };
        
        case FETCH_USERS:
            return { ...state, users: action.payload.data };
            
        default:
            return state;
    }
}