import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { required } from '../../helpers/validation-rules';
import Field from '../forms/field';
import { login } from '../../actions/authentication';

class Login extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            fields: {
                username: { value: '', error: '', rules: [required] },
                password: { value: '', error: '', rules: [required] }
            },
            serverError: '',
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidUpdate() {
        const { serverError, token, history, userId } = this.props;
        
        if (serverError !== this.state.serverError) this.setState({ serverError });
        
        if (token && userId) {
            //secure this
            sessionStorage.setItem('p2k_token', token);
            history.push('/');
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
                            rules={ username.rules }
                            error={ username.error }
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
        userId: state.authentication.userId
    };
};

export default connect(mapStateToProps, { login })(Login);