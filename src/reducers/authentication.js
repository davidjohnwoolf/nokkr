import { LOGIN_SUCCESS, LOGIN_ERROR, AUTHENTICATED, UNAUTHENTICATED } from '../actions/authentication';

export default function(state = {}, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state, token: action.token, userId: action.userId };
        
        case LOGIN_ERROR:
            return { ...state, serverError: action.serverError };
            
        case AUTHENTICATED:
            return { ...state, authenticated: true, id: action.id };
            
        case UNAUTHENTICATED:
            return { ...state, authenticated: false };
            
        default:
            return state;
    }
}