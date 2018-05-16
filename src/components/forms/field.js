import React from 'react';

class Field extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const { name, type, placeholder, value, handleUserInput, rules, error, message } = this.props;
        return (
            <div className="field">
                <p className="help">{ message }</p>
                <div className="control">
                    <input
                        className={ `input ${ error ? 'is-danger' : '' }` }
                        name={ name }
                        type={ type }
                        placeholder={ placeholder }
                        value={ value }
                        onChange={ event => handleUserInput(event, rules) }
                    />
                </div>
                <p className="help is-danger">{ error }</p>
            </div>
        );
    }
}

export default Field;