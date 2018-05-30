import { LOGIN_SUCCESS, LOGIN_ERROR, AUTHENTICATED, UNAUTHENTICATED, CLEAR_AUTH_MESSAGES, LOGOUT } from '../actions/authentication';

export default function(state = { authenticated: false }, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state, token: action.token, successMessage: action.successMessage, id: action.id, authenticated: true };
        
        case LOGIN_ERROR:
            return { ...state, serverError: action.serverError };
            
        case AUTHENTICATED:
            return { ...state, authenticated: true, id: action.id };
            
        case UNAUTHENTICATED:
            return { ...state, authenticated: false };
            
        case CLEAR_AUTH_MESSAGES:
            return { ...state, serverError: '', successMessage: '' };
            
        default:
            return state;
    }
}