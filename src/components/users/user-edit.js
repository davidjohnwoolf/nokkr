import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchUser, updateUser } from '../../actions/users.action';
import { validation } from '../helpers/users.helpers';

let initialized;

class UserEditForm extends React.Component {
    
    componentDidMount() {
        this.props.fetchUser(this.props.match.params.id);
        initialized = false;
    }
    
    componentDidUpdate() {
        if (!initialized) {
            this.handleInitialize();
        }
    }
    
    handleInitialize() {
        const user = this.props.user;
        
        if (user) {
            
            const initData = {
                "name": this.props.user.name,
                "username": this.props.user.username,
                "email": this.props.user.email
            };
            
            this.props.initialize(initData);
            initialized = true;
        }
    }
    
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
		this.props.updateUser(this.props.match.params.id, values, (res) => {
		    if (res.data.error) {
		        // make this happen in line with redux methodology
		        document.querySelector('.form-server-errors').innerHTML = res.data.error;
		    } else {
		        this.props.history.push(`/user/${ this.props.match.params.id }/?message=Updated+User+Successfully`);
		    }
		});
	}
    
    render() {
        const { handleSubmit, submitting } = this.props;

        return (
            <div className="component-page user-edit">
                <h1>Edit User</h1>
                
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
                        //validate={[ validation.password ]}
                    />
                    <Field
                        placeholder="Password Confirmation"
                        name="passwordConfirmation"
                        component={ this.renderField }
                        type="password"
                        //validate={[ validation.match ]}
                    />
                    <button className="form-submit" type="submit" disabled={ submitting }>
                        Update User
                    </button>
                    <Link className="default-button" to={ `/user/${ this.props.match.params.id }` }>Cancel</Link>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
	return { user: state.usersReducer.user };
};


export default reduxForm({
  form: 'userNewForm'
})(connect(mapStateToProps, { fetchUser, updateUser })(UserEditForm));