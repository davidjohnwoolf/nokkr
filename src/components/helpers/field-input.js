import React from 'react';

class Field extends React.Component {

    render() {
        const { name, type, placeholder, value, handleUserInput, error, message } = this.props;
        return (
            <div className="field">
                <small className={ message ? 'input-message' : 'invisible' }>{ message }</small>
                <div className="input">
                    <input
                        className={ error ? 'input-error' : '' }
                        name={ name }
                        type={ type }
                        placeholder={ placeholder }
                        value={ value }
                        onChange={ e => handleUserInput(e) }
                    />
                </div>
                <small className={ error ? 'input-error-message' : 'invisible' }>{ error }</small>
            </div>
        );
    }
}

export default Field;