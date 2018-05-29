import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { required, password, passwordMatch, validate } from '../helpers/validation';
import Field from '../forms/field';
import { createUser, clearUserMessages } from '../../actions/users';
import { sendMessage } from '../../actions/flash-messages';

class UserNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearUserMessages();
        
        this.validationRules = {
            name: [required],
            username: [required],
            email: [required],
            password: [required, password],
            passwordConfirmation: [required, passwordMatch]
        };
        
        this.state = {
            fields: {
                name: { value: '', error: '' },
                username: { value: '', error: '' },
                email: { value: '', error: '' },
                password: { value: '', error: '' },
                passwordConfirmation: { value: '', error: '' }
            },
            serverError: '',
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidUpdate() {
        const { serverError, successMessage, history, sendMessage } = this.props;
        
        if (serverError !== this.state.serverError) this.setState({ serverError });
        
        if (successMessage === 'User created') {
            sendMessage(successMessage);
            history.push('/users');
        }
    }
    
    handleUserInput(e, rules) {

        this.setState(
            validate(e, this.validationRules, { ...this.state.fields })
        );
    }
    
    handleSubmit(e) {
        
        e.preventDefault();
        
        const userData = { ...this.state.fields };
        
        for (let key in userData) { userData[key] = userData[key].value; }
        
        this.props.createUser({ ...userData });
    }
    
    render() {
        const { handleSubmit, handleUserInput } = this;
        const { name, username, email, password, passwordConfirmation } = this.state.fields;
        
        return (
                
            <main id="user-new" className="content">
                <section className="form">
                    <h1>Create User</h1>
                    <small className="server-error">{ this.state.serverError }</small>
                    <form onSubmit={ handleSubmit }>
                    
                        <Field
                            name="name"
                            type="text"
                            placeholder="name"
                            value={ name.value }
                            handleUserInput={ handleUserInput }
                            error={ name.error }
                        />
                        <Field
                            name="username"
                            type="text"
                            placeholder="username"
                            value={ username.value }
                            handleUserInput={ handleUserInput }
                            error={ username.error }
                        />
                        <Field
                            name="email"
                            type="email"
                            placeholder="email"
                            value={ email.value }
                            handleUserInput={ handleUserInput }
                            error={ email.error }
                        />
                        <Field
                            name="password"
                            type="password"
                            placeholder="password"
                            value={ password.value }
                            handleUserInput={ handleUserInput }
                            error={ password.error }
                        />
                        <Field
                            name="passwordConfirmation"
                            type="password"
                            placeholder="password confirmation"
                            value={ passwordConfirmation.value }
                            handleUserInput={ handleUserInput }
                            error={ passwordConfirmation.error }
                        />
                        
                        <div className="btn-group">
                            <button
                                disabled={ !this.state.formValid }
                                className="btn btn-primary"
                                type="submit">
                                Submit
                            </button>
                            <Link className="btn btn-cancel" to="/users">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </section>
            </main>
        );
    }
}

const mapStateToProps = state => {
    return { serverError: state.users.serverError, successMessage: state.users.successMessage };
};

export default connect(mapStateToProps, { clearUserMessages, createUser, sendMessage })(UserNew);