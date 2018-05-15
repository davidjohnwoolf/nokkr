import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { required, password, passwordMatch } from '../../helpers/validation-rules';
import Field from '../forms/field';
import { createUser, clearUserMessages } from '../../actions/users';
import { sendMessage } from '../../actions/flash-messages';

class UserNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.props.clearUserMessages();
        
        this.state = {
            fields: {
                name: { value: '', error: '', rules: [required] },
                username: { value: '', error: '', rules: [required] },
                email: { value: '', error: '', rules: [required] },
                password: { value: '', error: '', rules: [required, password] },
                passwordConfirmation: { value: '', error: '', rules: [required, passwordMatch] }
            },
            serverError: '',
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidUpdate(props) {
        const { serverError, successMessage, history, sendMessage } = this.props;
        
        if (serverError !== this.state.serverError) this.setState({ serverError });
        
        if (successMessage === 'User created') {
            sendMessage(successMessage);
            history.push('/users');
        }
    }
    
    handleUserInput(e, rules) {
        
        //export these functions to helper
        const fields = { ...this.state.fields };
        let formValid = true;
        let error;
        
        //handle all rules
        for (let key in fields ) {
            fields[key].rules.forEach(rule => {
                if (rule(fields[key].value)) formValid = false;
            });
        }
        
        //handle target rules
        rules.forEach(rule => {
            let result = rule(e.target.value);
            
            if (result) error = result;

            fields[e.target.name].error = error;
        });

        fields[e.target.name].value = e.target.value;
        
        this.setState({ fields, formValid });
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
                
            <section className="section columns is-centered user-new">
                <div className="container column is-half">
                    <h1 className="title">Create User</h1>
                    <p className="help is-danger server-error">{ this.state.serverError }</p>
                    <form id="user-new-form" onSubmit={ handleSubmit }>
                    
                        <Field
                            name="name"
                            type="text"
                            placeholder="name"
                            value={ name.value }
                            handleUserInput={ handleUserInput }
                            rules={ name.rules }
                            error={ name.error }
                        />
                        <Field
                            name="username"
                            type="text"
                            placeholder="username"
                            value={ username.value }
                            handleUserInput={ handleUserInput }
                            rules={ username.rules }
                            error={ username.error }
                        />
                        <Field
                            name="email"
                            type="email"
                            placeholder="email"
                            value={ email.value }
                            handleUserInput={ handleUserInput }
                            rules={ email.rules }
                            error={ email.error }
                        />
                        <Field
                            name="password"
                            type="password"
                            placeholder="password"
                            value={ password.value }
                            handleUserInput={ handleUserInput }
                            rules={ password.rules }
                            error={ password.error }
                        />
                        <Field
                            name="passwordConfirmation"
                            type="password"
                            placeholder="password confirmation"
                            value={ passwordConfirmation.value }
                            handleUserInput={ handleUserInput }
                            rules={ passwordConfirmation.rules }
                            error={ passwordConfirmation.error }
                        />
                        
                        <div className="field is-grouped">
                            <div className="control">
                                <button
                                    disabled={ !this.state.formValid }
                                    className="button is-primary"
                                    type="submit">
                                    Submit
                                </button>
                            </div>
                            <div className="control">
                                <Link className="button is-light" to="/users">
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => {
    return { serverError: state.users.serverError, successMessage: state.users.successMessage };
};

export default connect(mapStateToProps, { clearUserMessages, createUser, sendMessage })(UserNew);