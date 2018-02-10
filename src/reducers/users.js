import { FETCH_USER } from '../actions/users';

export default function(state = {}, action) {
    switch (action.type) {
        case FETCH_USER:
            return { ...state, [action.payload.data.id]: action.payload.data };
            
        default:
            return state;
    }
}