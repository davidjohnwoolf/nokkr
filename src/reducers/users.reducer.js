import { FETCH_USER } from '../actions/users.action';

export default function(state = {}, action) {

    switch (action.type) {
        case 'FETCH_USER':
            return { ...state, user: action.payload.data };
        
        default:
            return state;
    }
}