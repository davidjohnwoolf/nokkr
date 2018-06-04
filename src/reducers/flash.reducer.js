import { SEND_MESSAGE, CLOSE_MESSAGE, SEND_ERROR } from '../actions/flash.action';

export default function(state = {}, action) {

    switch (action.type) {
        case SEND_MESSAGE:
            return { ...state, message: action.message };
            
        case SEND_ERROR:
            return { ...state, error: true, message: action.message };
            
        case CLOSE_MESSAGE:
            return {};

        default:
            return state;
    }
}