export const SEND_MESSAGE = 'SEND_MESSAGE';
export const CLOSE_MESSAGE = 'CLOSE_MESSAGE';

export const sendMessage = message => {
    return dispatch => {
        dispatch({
            type: SEND_MESSAGE,
            message: message
        });
    }
}

export const closeMessage = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MESSAGE,
            message: ''
        });
    }
}