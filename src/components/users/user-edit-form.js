import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { fetchUser, updateUser } from '../../actions/users.action';
import { validation } from './helpers';

class UserEditForm extends React.Component {
    
    constructor(props) {
        super(props);
        this.props.fetchUser(this.props.match.params.id);
    }
    
    renderField(field) {
        const { meta: { touched, error } } = field;
		const classNames = `form-field ${ touched && error ? 'form-error' : '' }`;
		
		console.log(field.value)
		return (
			<div className={ classNames }>
				<input
					type={ field.type }
					placeholder={ field.placeholder }
					className="form-input"
					value={ field.value }
					{ ...field.input }
				/>
				<div className="form-error-message">
					{ touched && (error && <span>{ error }</span>) }
				</div>
			</div>
		);
	}
    
    onSubmit(values) {
		this.props.updateUser(values, (res) => {
		    if (res.data.error) {
		        // make this happen in line with redux methodology
		        document.querySelector('.form-server-errors').innerHTML = res.data.error;
		    } else {
		        this.props.history.push(`/user/${ this.props.match.params.id }/?message=Updated+User+Successfully`);
		    }
		});
	}
    
    render() {
        const { user, handleSubmit, submitting } = this.props;
        
        if (!user) return <div>loading</div>;
        
        return (
            <div className="component-page user-edit">
                <h1>Edit User</h1>
                
                <div className="form-server-errors"></div>
                
                <form className="form" onSubmit={ handleSubmit(this.onSubmit.bind(this)) }>
                    <Field
                        placeholder="Full Name"
                        value={ user.name }
                        name="name"
                        component={ this.renderField }
                        type="text"
                        validate={[ validation.required ]}
                    />
                    <Field
                        placeholder="Username"
                        value={ user.username }
                        name="username"
                        component={ this.renderField }
                        type="text"
                        validate={[ validation.required ]}
                    />
                    <Field
                        placeholder="Email"
                        value={ user.email }
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
                        validate={[ validation.match ]}
                    />
                    <button className="form-submit" type="submit" disabled={ submitting }>
                        Update User
                    </button>
                </form>
            </div>
        );
    }
}

/*InitializeFromStateForm = reduxForm({
  form: 'initializeFromState'  // a unique identifier for this form
})(InitializeFromStateForm)

// You have to connect() to any reducers that you wish to connect to yourself
InitializeFromStateForm = connect(
  state => ({
    initialValues: state.account.data // pull initial values from account reducer
  }),
  { load: loadAccount }               // bind account loading action creator
)(InitializeFromStateForm)

export default InitializeFromStateForm
*/
const mapStateToProps = state => {
	return { user: state.usersReducer.user };
};


export default reduxForm({
  form: 'userNewForm'
})(connect(mapStateToProps, { fetchUser, updateUser })(UserEditForm));