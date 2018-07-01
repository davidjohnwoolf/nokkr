import React from 'react';

class Field extends React.Component {

    render() {
        const { name, label, value, handleUserInput, error, message } = this.props;
        return (
            <div className="field">
                <small className={ message ? 'input-message' : 'invisible' }>{ message }</small>
                <div className="checkbox">
                    <input
                        name={ name }
                        id={ name }
                        type="checkbox"
                        value={ value }
                        onChange={ e => handleUserInput(e) }
                    />
                    <label htmlFor={ name }>{ label }</label>
                </div>
                <small className={ error ? 'input-error-message' : 'invisible' }>{ error }</small>
            </div>
        );
    }
}

export default Field;