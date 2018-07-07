import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { required, validate } from '../helpers/forms';
import FieldInput from '../forms/field-input';
import { login, clearAuth } from '../../actions/auth.action';

class Login extends React.Component {
    
    constructor(props) {
        super(props);
        
        if (props.authenticated) {
            props.history.push('/');
        } else {
            props.clearAuth();
        }
        
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
        const { success, fail, message, token, history, id } = this.props;
        
        if (fail && (message !== this.state.serverError)) this.setState({ serverError: message });
        
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
        
        const credsData = { ...this.state.fields };
        
        for (let key in credsData) { credsData[key] = credsData[key].value; }
        
        this.props.login({ ...credsData });
    }
    
    render() {
        const { handleSubmit, handleUserInput } = this;
        const { username, password } = { ...this.state.fields };
        
        return (
                
            <main id="login" className="content">
                <section className="form">
                    <h1>Login</h1>
                    <small className="server-error">{ this.state.serverError }</small>
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
                        
                        <div className="btn-group">
                            <button
                                disabled={ !this.state.formValid }
                                className="btn btn-primary"
                                type="submit">
                                Submit
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    token: state.auth.token,
    id: state.auth.id,
    authenticated: state.auth.authenticated,
    success: state.auth.success,
    fail: state.auth.fail,
    message: state.auth.message
});

export default withRouter(connect(mapStateToProps, { login, clearAuth })(Login));