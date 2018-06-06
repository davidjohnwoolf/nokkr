import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { required, password, passwordMatch, validate } from '../helpers/validation';
import FieldInput from '../helpers/field-input';
import { createUser, clearUser } from '../../actions/users.action';
import { sendMessage } from '../../actions/flash.action';

class UserNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearUser();
        
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
        const { success, fail, message, history, sendMessage } = this.props;
        
        if (fail && (message !== this.state.serverError)) this.setState({ serverError: message });
        
        if (success) {
            sendMessage(message);
            history.push('/users');
        }
    }
    
    handleUserInput(e) {

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
                    
                        <FieldInput
                            name="name"
                            type="text"
                            placeholder="name"
                            value={ name.value }
                            handleUserInput={ handleUserInput }
                            error={ name.error }
                        />
                        <FieldInput
                            name="username"
                            type="text"
                            placeholder="username"
                            value={ username.value }
                            handleUserInput={ handleUserInput }
                            error={ username.error }
                        />
                        <FieldInput
                            name="email"
                            type="email"
                            placeholder="email"
                            value={ email.value }
                            handleUserInput={ handleUserInput }
                            error={ email.error }
                        />
                        <FieldInput
                            name="password"
                            type="password"
                            placeholder="password"
                            value={ password.value }
                            handleUserInput={ handleUserInput }
                            error={ password.error }
                        />
                        <FieldInput
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

const mapStateToProps = state => ({
    message: state.users.message,
    success: state.users.success,
    fail: state.users.fail
});

export default connect(mapStateToProps, { clearUser, createUser, sendMessage })(UserNew);