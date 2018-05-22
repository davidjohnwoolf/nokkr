import { LOGIN_SUCCESS, LOGIN_ERROR } from '../actions/authentication';

export default function(state = {}, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state, token: action.token };
        
        case LOGIN_ERROR:
            return { ...state, serverError: action.serverError };
            
        default:
            return state;
    }
} 