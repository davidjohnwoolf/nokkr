import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { required, password, passwordMatch } from '../../helpers/validation-rules';
import Field from '../forms/field';
import { fetchUser, updateUser, clearUserMessages } from '../../actions/users';
import { sendMessage } from '../../actions/flash-messages';

//regarding lifecycle method warnings https://github.com/reduxjs/react-redux/issues/890

class UserEdit extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearUserMessages();
        props.fetchUser(this.props.match.params.id);
        
        //move rules outside of the state since they are static?
        this.state = {
            fields: {
                name: { value: '', error: '', rules: [required] },
                username: { value: '', error: '', rules: [required] },
                email: { value: '', error: '', rules: [required] },
                password: { value: '', error: '', rules: [password] },
                passwordConfirmation: { value: '', error: '', rules: [passwordMatch] }
            },
            serverError: '',
            formValid: false,
            hasInitialized: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {

        const fields = { ...prevState.fields };
        const { user } = nextProps;
        
        if (user) {
            fields.name.value = user.name;
            fields.username.value = user.username;
            fields.email.value = user.email;
        }
        
        return fields;
    }

    
    componentDidUpdate() {
        const { serverError, successMessage, history, sendMessage } = this.props;
        
        if (serverError !== this.state.serverError) this.setState({ serverError });
        
        if (successMessage === 'User updated') {
            sendMessage(successMessage);
            history.push(`/users/${ this.props.match.params.id }`);
        }
    }
    
    handleUserInput(e, rules) {
        
        //export these functions to helper
        const fields = { ...this.state.fields };
        let formValid = true;
        let error;
        
        //typing something in password field then stopping is not working
        
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
        
        for (let key in userData) {
            if (userData[key].value) {
                userData[key] = userData[key].value;
            } else {
                delete userData[key];
            }
        }
        
        this.props.updateUser(this.props.match.params.id, { ...userData });
    }
    
    render() {
        const { handleSubmit, handleUserInput } = this;
        const { name, username, email, password, passwordConfirmation } = this.state.fields;
        
        return (
                
            <main id="user-edit" className="content">
                <section className="form">
                    <h1>Edit User</h1>
                    <small className="server-error">{ this.state.serverError }</small>
                    <form onSubmit={ handleSubmit }>
                    
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
                            message="If staying the same, leave password fields blank"
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
                        <div className="btn-group">
                            <button
                                disabled={ !this.state.formValid }
                                className="btn btn-primary"
                                type="submit">
                                Submit
                            </button>
                            <Link className="btn btn-cancel" to={ `/users/${ this.props.match.params.id }` }>
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
    return {
        serverError: state.users.serverError,
        successMessage: state.users.successMessage,
        user: state.users.user
    };
};

export default connect(mapStateToProps, { fetchUser, clearUserMessages, updateUser, sendMessage })(UserEdit);