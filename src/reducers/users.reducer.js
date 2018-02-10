import { FETCH_USER, FETCH_USERS } from '../actions/users.action';

export default function(state = {}, action) {
    switch (action.type) {
        case FETCH_USER:
            return { ...state, [action.payload.data.id]: action.payload.data };
        
        case FETCH_USERS:
            return { ...state, [action.payload.data.id]: action.payload.data };
            
        default:
            return state;
    }
}