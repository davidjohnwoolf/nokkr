import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { required, validate, formSubmit } from '../helpers/forms';
import FieldInput from '../forms/field-input';
import { login, clearAuth } from '../../actions/auth.action';

class Login extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.authenticated
            ? props.history.push('/')
            :props.clearAuth();
        
        this.validationRules = Object.freeze({
            username: [required],
            password: [required]
        });
        
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
        const {
            props: { success, fail, message, token, history },
            state: { serverError }
        } = this;
        
        if (fail && (message !== serverError)) this.setState({ serverError: message });
        
        if (success) {
            sessionStorage.setItem('token', token);
            history.push('/');
        }
    }
    
    handleUserInput(e) {
        
        this.setState(
            validate(e, this.validationRules, { ...this.state.fields })
        );
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const { state: { fields }, props: { login } } = this;
        
        formSubmit({ fields: { ...fields }, action: login });
    }
    
    render() {
        const {
            state: { serverError, formValid, fields: { username, password } },
            handleSubmit,
            handleUserInput
        } = this;
        
        return (
                
            <main id="login" className="content">
                <section className="form">
                    <h1>Login</h1>
                    <small className="server-error">{ serverError }</small>
                    <form onSubmit={ handleSubmit }>
                    
                        <FieldInput
                            name="username"
                            type="text"
                            placeholder="username"
                            value={ username.value }
                            handleUserInput={ handleUserInput }
                            error={ username.error }
                        />
                        <FieldInput
                            name="password"
                            type="password"
                            placeholder="password"
                            value={ password.value }
                            handleUserInput={ handleUserInput }
                            error={ password.error }
                        />
                        
                        <button
                            disabled={ !formValid }
                            className="button primary"
                            type="submit">
                            Login
                        </button>
                    </form>
                </section>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    token: state.auth.token,
    authenticated: state.auth.authenticated,
    success: state.auth.success,
    fail: state.auth.fail,
    message: state.auth.message
});

export default withRouter(connect(mapStateToProps, { login, clearAuth })(Login));