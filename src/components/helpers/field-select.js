import React from 'react';

class FormSelect extends React.Component {
    
    renderOptions(options) {
        return (
            options.map(option => {
                return (
                    <option key={ option[1] } value={ option[1] }>
                        { option[0] }
			        </option>
                );
            })
        );
    }

    render() {
        const { name, value, handleUserInput, error, options, message } = this.props;
        return (
            <div className="field">
                <small className={ message ? 'input-message' : 'invisible' }>{ message }</small>
                <div className="select">
                    <select name={ name } value={ value } onChange={ event => handleUserInput(event) }>
                        { this.renderOptions(options) }
                    </select>
                </div>
                <small className={ error ? 'input-error-message' : 'invisible' }>{ error }</small>
            </div>
        );
    }
}

export default FormSelect;