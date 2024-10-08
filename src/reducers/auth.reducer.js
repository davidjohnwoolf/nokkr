import { LOGIN, LOGIN_FAIL, CLEAR_AUTH } from '../actions/auth.action';

export default function(state = { authenticated: false }, action) {
    switch (action.type) {
        case LOGIN:
            return {
                success: true,
                token: action.token,
                role: action.role,
                isReadOnly: action.isReadOnly,
                sessionTeam: action.sessionTeam,
                sessionId: action.sessionId,
                authenticated: true
            };
        
        case LOGIN_FAIL:
            return { fail: true, message: action.message };
            
        case CLEAR_AUTH:
            return { ...state, success: false, authenticated: false, message: '' };
            
        default:
            return state;
    }
}