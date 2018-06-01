import React from 'react';
import { connect } from 'react-redux';

import { required, validate } from '../helpers/validation';
import Field from '../forms/field';
import { login, clearAuth } from '../../actions/authentication';

class Login extends React.Component {
    
    constructor(props) {
        super(props);
        
        if (props.authenticated) {
            props.history.push('/');
        }
        
        props.clearAuth();
        
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
        const { success, fail, message, token, history, id } = this.props;
        
        if (fail && (message !== this.state.serverError)) this.setState({ serverError: message });
        
        if (success) {
            sessionStorage.setItem('token', token);
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
        const { username, password } = { ...this.state.fields };
        
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
                        </div>
                    </form>
                </section>
            </main>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.authentication.token,
        id: state.authentication.id,
        authenticated: state.authentication.authenticated,
        success: state.authentication.success,
        fail: state.authentication.fail,
        message: state.authentication.message
    };
};

export default connect(mapStateToProps, { login, clearAuth })(Login);