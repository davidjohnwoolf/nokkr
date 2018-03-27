import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { login } from '../../actions/authentication.action';
// create authentication helper for validation?
import { validation } from '../helpers/users.helpers';

class LoginForm extends React.Component {
    
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
		this.props.login(values, (res) => {
		    if (res.data.error) {
		        // make this happen in line with redux methodology, make a prop
		        document.querySelector('.form-server-errors').innerHTML = res.data.error;
		    } else {
		        // secure this shit
		        window.sessionStorage.platform2k_token = res.data.token;
		        this.props.history.push('/?message=Logged+In+Successfully');
		    }
		});
	}
    
    render() {
        const { handleSubmit, submitting } = this.props;

        return (
            <div className="component-page login">
                <h1>Login</h1>
                
                <div className="form-server-errors"></div>
                
                <form className="form" onSubmit={ handleSubmit(this.onSubmit.bind(this)) }>
                    <Field
                        placeholder="Username"
                        name="username"
                        component={ this.renderField }
                        type="text"
                        validate={[ validation.required ]}
                    />
                    <Field
                        placeholder="Password"
                        name="password"
                        component={ this.renderField }
                        type="password"
                        validate={[ validation.required ]}
                    />
                    <button className="form-submit" type="submit" disabled={ submitting }>
                        Login
                    </button>
                </form>
            </div>
        );
    }
}

export default reduxForm({
  form: 'userLoginForm'
})(connect(null, { login })(LoginForm));