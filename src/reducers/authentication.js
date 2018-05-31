import { LOGIN_SUCCESS, LOGIN_FAIL, AUTHENTICATED, UNAUTHENTICATED, CLEAR_AUTH, LOGOUT } from '../actions/authentication';

export default function(state = { authenticated: false }, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state, success: true, token: action.token, id: action.id, authenticated: true };
        
        case LOGIN_FAIL:
            return { ...state, fail: true, message: action.message };
            
        case AUTHENTICATED:
            return { ...state, authenticated: true, id: action.id };
            
        case UNAUTHENTICATED:
            return { ...state, authenticated: false };
            
        case CLEAR_AUTH:
            return { authenticated: false };
            
        default:
            return state;
    }
}