import {
    FETCH_ACCOUNT,
    UPDATE_ACCOUNT,
    CLEAR_ACCOUNT
} from '../actions/account.action';

export default function(state = {}, action) {

    switch (action.type) {
        
        case FETCH_ACCOUNT:
            return { ...state, account: action.payload };
        
        case UPDATE_ACCOUNT:
            return { ...state, success: true, message: action.message };
        
        case CLEAR_ACCOUNT:
            return { ...state, success: false, message: '' };
            
        default:
            return state;
    }
}