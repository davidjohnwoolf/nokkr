import React from 'react';

const FieldCheckbox = ({ name, label, checked, value, handleUserInput, error, message, disabled }) => {
    return (
        <div className="field">
            <small className={ message ? 'input-message' : 'invisible' }>{ message }</small>
            <div className="checkbox">
                <input
                    name={ name }
                    id={ name }
                    type="checkbox"
                    checked={ checked ? 'checked' : '' }
                    value={ value }
                    onChange={ e => handleUserInput(e) }
                    disabled={ disabled }
                />
                <label htmlFor={ name }>{ label }</label>
            </div>
            <small className={ error ? 'input-error-message' : 'invisible' }>{ error }</small>
        </div>
    );
};

export default FieldCheckbox;