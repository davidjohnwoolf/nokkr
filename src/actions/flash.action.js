export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_ERROR = 'SEND_ERROR';
export const CLOSE_MESSAGE = 'CLOSE_MESSAGE';

export const sendMessage = message => {
    return dispatch => {
        dispatch({
            type: SEND_MESSAGE,
            message: message
        });
        
        setTimeout(() => dispatch({ type: CLOSE_MESSAGE }), 3000);
    };
};

export const sendError = message => {
    return dispatch => {
        dispatch({
            type: SEND_ERROR,
            message: message
        });
    };
};

export const closeMessage = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MESSAGE
        });
    };
};