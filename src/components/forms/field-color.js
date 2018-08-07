import React from 'react';

const FieldColor = ({ name, label, value, handleUserInput, error, message }) => {

    return (
        <div className="field">
            <small className={ message ? 'input-message' : 'invisible' }>{ message }</small>
            <div className="color-picker">
                { label ? <label>{ label }</label> : '' }
                <input
                    className={ error ? 'input-error' : '' }
                    name={ name }
                    type="color"
                    value={ value }
                    onChange={ e => handleUserInput(e) }
                />
            </div>
            <small className={ error ? 'input-error-message' : 'invisible' }>{ error }</small>
        </div>
    );
}

export default FieldColor;