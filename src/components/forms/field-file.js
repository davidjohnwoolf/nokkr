import React from 'react';

class FieldFile extends React.Component {

    render() {
        const { name, label, value, handleUserInput, error, message } = this.props;
        return (
            <div className="field">
                <small className={ message ? 'input-message' : 'invisible' }>{ message }</small>
                <div className="input">
                    <label>{ label }</label>
                    <input
                        className={ error ? 'input-error' : '' }
                        name={ name }
                        type="file"
                        value={ value }
                        onChange={ e => handleUserInput(e) }
                    />
                </div>
                <small className={ error ? 'input-error-message' : 'invisible' }>{ error }</small>
            </div>
        );
    }
}

export default FieldFile;