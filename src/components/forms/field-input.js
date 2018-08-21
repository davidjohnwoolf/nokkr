import React from 'react';

const FieldInput = ({ name, type, placeholder, value, handleUserInput, error, message, inputStyles }) => {

    return (
        <div className="field">
            <small className={ message ? 'input-message' : 'invisible' }>{ message }</small>
            <div className="input">
                <input
                    className={ error ? 'input-error' : '' }
                    style={ inputStyles }
                    name={ name }
                    type={ type }
                    placeholder={ placeholder || '' }
                    value={ value }
                    onChange={ e => handleUserInput(e) }
                />
            </div>
            <small className={ error ? 'input-error-message' : 'invisible' }>{ error }</small>
        </div>
    );
}

export default FieldInput;