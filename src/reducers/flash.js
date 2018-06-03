import { SEND_MESSAGE, CLOSE_MESSAGE } from '../actions/flash';

export default function(state = {}, action) {

    switch (action.type) {
        case SEND_MESSAGE:
            return { ...state, message: action.message };
            
        case CLOSE_MESSAGE:
            return {};

        default:
            return state;
    }
}