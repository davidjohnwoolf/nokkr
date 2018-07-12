import React from 'react';

class FieldColor extends React.Component {

    render() {
        const { name, label, value, handleUserInput, error, message } = this.props;
        return (
            <div className="field">
                <small className={ message ? 'input-message' : 'invisible' }>{ message }</small>
                <div className="color-picker">
                    <label>{ label }</label>
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
}

export default FieldColor;