import React from 'react';

const FieldSelect = ({ name, value, handleUserInput, error, options, message }) => {

    return (
        <div className="field">
            <small className={ message ? 'input-message' : 'invisible' }>{ message }</small>
            <div className="select">
                <select name={ name } value={ value } onChange={ event => handleUserInput(event) }>
                    { options.map(option => {
                        return (
                            <option key={ option[1] } value={ option[1] }>
                                { option[0] }
        			        </option>
                        );
                    }) }
                </select>
            </div>
            <small className={ error ? 'input-error-message' : 'invisible' }>{ error }</small>
        </div>
    );
}

export default FieldSelect;