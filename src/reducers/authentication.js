import { LOGIN_SUCCESS, LOGIN_ERROR } from '../actions/authentication';

export default function(state = {}, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state, token: action.token, userId: action.userId };
        
        case LOGIN_ERROR:
            return { ...state, serverError: action.serverError };
        
        // //action dispatch in app.js
        // case AUTHENTICATE:
        //     return { ...state, authenticated: true };
        
        // //action dispatch in app.js
        // case UNAUTHENTICATE:
        //     return { ...state, authenticated: false };
            
        default:
            return state;
    }
}