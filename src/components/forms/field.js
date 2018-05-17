import React from 'react';

class Field extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const { name, type, placeholder, value, handleUserInput, rules, error, message } = this.props;
        return (
            <div className="field">
                <small>{ message }</small>
                <div className="input">
                    <input
                        className={ error ? 'input-error' : 'input' }
                        name={ name }
                        type={ type }
                        placeholder={ placeholder }
                        value={ value }
                        onChange={ event => handleUserInput(event, rules) }
                    />
                </div>
                <small className="error">{ error }</small>
            </div>
        );
    }
}

export default Field;