import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { required, validate } from '../../helpers/validation';
import Field from '../forms/field';
import { login, clearAuthMessages } from '../../actions/authentication';
import { sendMessage } from '../../actions/flash-messages';

class Login extends React.Component {
    
    //add clear messages
    
    constructor(props) {
        super(props);
        
        if (props.authenticated) {
            props.history.push('/');
        }
        
        props.clearAuthMessages();
        
        this.validationRules = {
            username: [required],
            password: [required]
        };
        
        this.state = {
            fields: {
                username: { value: '', error: '' },
                password: { value: '', error: '' }
            },
            serverError: '',
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidUpdate() {
        const { serverError, token, history, successMessage, id, sendMessage } = this.props;
        
        if (serverError !== this.state.serverError) this.setState({ serverError });
        
        if (token && (successMessage === 'Logged in') && id) {
            //secure this
            sendMessage(successMessage);
            sessionStorage.setItem('p2k_token', token);
            history.push(`/users/${id}`);
        }
    }
    
    handleUserInput(e, rules) {
        
        this.setState(
            validate(e, this.validationRules, { ...this.state.fields })
        );
    }
    
    handleSubmit(e) {
        
        e.preventDefault();
        
        const credsData = { ...this.state.fields };
        
        for (let key in credsData) { credsData[key] = credsData[key].value; }
        
        this.props.login({ ...credsData });
    }
    
    render() {
        const { handleSubmit, handleUserInput } = this;
        const { username, password } = this.state.fields;
        
        return (
                
            <main id="login" className="content">
                <section className="form">
                    <h1>Login</h1>
                    <small className="server-error">{ this.state.serverError }</small>
                    <form onSubmit={ handleSubmit }>
                    
                        <Field
                            name="username"
                            type="text"
                            placeholder="username"
                            value={ username.value }
                            handleUserInput={ handleUserInput }
                            error={ username.error }
                        />
                        <Field
                            name="password"
                            type="password"
                            placeholder="password"
                            value={ password.value }
                            handleUserInput={ handleUserInput }
                            error={ password.error }
                        />
                        
                        <div className="btn-group">
                            <button
                                disabled={ !this.state.formValid }
                                className="btn btn-primary"
                                type="submit">
                                Submit
                            </button>
                            <Link className="btn btn-cancel" to="/">
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
        serverError: state.authentication.serverError,
        token: state.authentication.token,
        id: state.authentication.id,
        authenticated: state.authentication.authenticated,
        successMessage: state.authentication.successMessage
    };
};

export default connect(mapStateToProps, { login, clearAuthMessages, sendMessage })(Login);