import React from 'react';

const SubmitBlock = ({ history, formValid, submitText }) => {
    return (
        <div className="button-group">
            <button
                disabled={ !formValid }
                className="button success"
                type="submit">
                { submitText }
            </button>
            <a onClick={ history.goBack } className="button cancel">Cancel</a>
        </div>
    );
};

export default SubmitBlock;