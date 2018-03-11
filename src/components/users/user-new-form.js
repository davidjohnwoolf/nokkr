import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { createUser } from '../../actions/users.action';

const validation = {
    required: value => value ? undefined : 'Required',
    password: value => {
        return value && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,24}/.test(value)
            ? undefined
            : 'Password must contain 8-24 characters including a number, an uppercase and lowercase letter, and a special character'
    },
    match: () => {
        return document.querySelector('[name=password]').value === document.querySelector('[name=passwordConfirmation]').value
            ? undefined
            : 'Passwords must match'
    }
};

class UserNewForm extends React.Component {
    
    renderField(field) {
        const { meta: { touched, error } } = field;
		const classNames = `form-field ${ touched && error ? 'form-error' : '' }`;
		
		return (
			<div className={ classNames }>
				<input
					type={ field.type }
					placeholder={ field.placeholder }
					className="form-input"
					{ ...field.input }
				/>
				<div className="form-error-message">
					{ touched && (error && <span>{ error }</span>) }
				</div>
			</div>
		);
	}
    
    onSubmit(values) {
		this.props.createUser(values, (res) => {
		    if (res.data.error) {
		           // make this happen in line with redux methodology
		        document.querySelector('.form-server-errors').innerHTML = res.data.error;
		    } else {
		        this.props.history.push('/?message=Created+User+Successfully');
		    }
		});
	}
    
    render() {
        const { handleSubmit, submitting } = this.props;

        return (
            <div className="component-page user-create">
                <h1>New User</h1>
                
                <div className="form-server-errors"></div>
                
                <form className="form" onSubmit={ handleSubmit(this.onSubmit.bind(this)) }>
                    <Field
                        placeholder="Full Name"
                        name="name"
                        component={ this.renderField }
                        type="text"
                        validate={[ validation.required ]}
                    />
                    <Field
                        placeholder="Username"
                        name="username"
                        component={ this.renderField }
                        type="text"
                        validate={[ validation.required ]}
                    />
                    <Field
                        placeholder="Email"
                        name="email"
                        component={ this.renderField }
                        type="email"
                        validate={[ validation.required ]}
                    />
                    <Field
                        placeholder="Password"
                        name="password"
                        component={ this.renderField }
                        type="password"
                        validate={[ validation.password ]}
                    />
                    <Field
                        placeholder="Password Confirmation"
                        name="passwordConfirmation"
                        component={ this.renderField }
                        type="password"
                        validate={[ validation.password, validation.match ]}
                    />
                    <button className="form-submit" type="submit" disabled={ submitting }>
                        Create User
                    </button>
                </form>
            </div>
        );
    }
}

export default reduxForm({
  form: 'userNewForm'
})(connect(null, { createUser })(UserNewForm));