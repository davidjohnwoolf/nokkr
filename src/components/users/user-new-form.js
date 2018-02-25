import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { createUser } from '../../actions/users.action';

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
					{ touched ? error : '' }
				</div>
			</div>
		);
	}
    
    onSubmit(values) {
		this.props.createUser(values, (res) => {
		    if (res.data.error) {
		        document.querySelector('.form-errors').innerHTML = res.data.error;
		    } else {
		        this.props.history.push('/?message=Created+User+Successfully');
		    }
		});
	}
    
    render() {
        const { errors, handleSubmit } = this.props;
        return (
            <div className="component-page user-create">
                <h1>New User</h1>
                
                <div className="form-errors"></div>
                
                <form className="form" onSubmit={ handleSubmit(this.onSubmit.bind(this)) }>
                    <Field
                        placeholder="Full Name"
                        name="name"
                        component={ this.renderField }
                        type="text"
                    />
                    <Field
                        placeholder="Username"
                        name="username"
                        component={ this.renderField }
                        type="text"
                    />
                    <Field
                        placeholder="Email"
                        name="email"
                        component={ this.renderField }
                        type="email"
                    />
                    <Field
                        placeholder="Password"
                        name="password"
                        component={ this.renderField }
                        type="password"
                    />
                    <Field
                        placeholder="Password Confirmation"
                        name="passwordConfirmation"
                        component={ this.renderField }
                        type="password"
                    />
                    <button className="form-submit" type="submit">
                        Create User
                    </button>
                </form>
            </div>
        );
    }
}

/*function validate(values) {
	const errors = {};
	
	if (!values.name) errors.name = "Please enter a full name";

	if (!values.username) errors.username = "Please enter a username";
	
	if (!values.email) errors.email = "Please enter an email address";

	if (!values.password) errors.password = "Please enter a password";
	
	if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,24}/.test(values.password)) {
	    errors.password = "Password must contain one uppercase letter, one lowercase letter, one number and a special character and be 8-24 characters long";
	}
	
	if (!values.passwordConfirmation) errors.passwordConfirmation = "Please enter your password again";
	
	if (values.passwordConfirmation !== values.password) errors.passwordConfirmation = "Passwords must match";

	return errors;
}*/

export default reduxForm({
  form: 'userNewForm'
})(connect(null, { createUser })(UserNewForm));