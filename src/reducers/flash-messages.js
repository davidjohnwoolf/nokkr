import { SEND_MESSAGE, CLOSE_MESSAGE } from '../actions/flash-messages';

export default function(state = {}, action) {

    switch (action.type) {
        case SEND_MESSAGE:
            return { ...state, flashMessage: action.flashMessage };
            
        case CLOSE_MESSAGE:
            return { ...state, flashMessage: action.flashMessage };

        default:
            return state;
    }
}