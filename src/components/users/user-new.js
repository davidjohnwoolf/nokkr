import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import validationRules from '../../helpers/validation-rules';
import Field from '../forms/field';
import { createUser } from '../../actions/users';

//remake server errors
//give form green style on untouched itmes with mouseover?


class UserNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        //set local component state for user inputs
        this.state = {
            fields: {
                name: {
                    value: '',
                    error: '',
                },
                username: {
                    value: '',
                    error: ''
                },
                email: {
                    value: '',
                    error: ''
                },
                password: {
                    value: '',
                    error: ''
                },
                passwordConfirmation: {
                    value: '',
                    error: ''
                }
            },
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidUpdate() {
        const { error: serverError, message, history } = this.props;
        
        if (serverError) {
            document.querySelector('.user-new .server-error').innerHTML = serverError;
        }
        
        if (message) {
            //set up flash message
            history.push('/users');
        }
    }
    
    handleUserInput(e, rules) {
        //how to make password match for passwordConfirmation apply when password is changed?
        const fields = { ...this.state.fields };
        let formValid = true;
        let error;
        
        //handle entire form rules
        for (let key in validation ) {
            validation[key].forEach(rule => {
                let result = rule(document.querySelector(`input[name=${ key }`).value);
                
                if (result) {
                    formValid = false;
                }
            });
        }
        
        //handle target rules
        rules.forEach((rule, i, a) => {
            let result = rule(e.target.value);
            
            if (result) error = result;

            fields[e.target.name].error = error;
        });

        fields[e.target.name].value = e.target.value;
        
        this.setState({ fields, formValid });
    }
    
    handleSubmit(e) {
        //set rules
        
        e.preventDefault();
        
        this.props.createUser({
            name: document.querySelector('input[name=name]').value,
            username: document.querySelector('input[name=username]').value,
            email: document.querySelector('input[name=email]').value,
            password: document.querySelector('input[name=password]').value,
            passwordConfirmation: document.querySelector('input[name=passwordConfirmation]').value
        });
    }
    
    render() {
        return (
                
            <section className="section columns is-centered user-new">
                <div className="container column is-half">
                    <h1 className="title">Create User</h1>
                    <p className="help is-danger server-error"></p>
                    <form id="user-new-form" onSubmit={ this.handleSubmit }>
                    
                        <Field
                            name="name"
                            type="text"
                            placeholder="name"
                            value={ this.state.fields.name.value }
                            handleUserInput={ this.handleUserInput }
                            rules={ validation.name }
                            error={ this.state.fields.name.error }
                        />
                        <Field
                            name="username"
                            type="text"
                            placeholder="username"
                            value={ this.state.fields.username.value }
                            handleUserInput={ this.handleUserInput }
                            rules={ validation.username }
                            error={ this.state.fields.username.error }
                        />
                        <Field
                            name="email"
                            type="email"
                            placeholder="email"
                            value={ this.state.fields.email.value }
                            handleUserInput={ this.handleUserInput }
                            rules={ validation.email /*create email rules*/ }
                            error={ this.state.fields.email.error }
                        />
                        <Field
                            name="password"
                            type="password"
                            placeholder="password"
                            value={ this.state.fields.password.value }
                            handleUserInput={ this.handleUserInput }
                            rules={ validation.password }
                            error={ this.state.fields.password.error }
                        />
                        <Field
                            name="passwordConfirmation"
                            type="password"
                            placeholder="password confirmation"
                            value={ this.state.fields.passwordConfirmation.value }
                            handleUserInput={ this.handleUserInput }
                            rules={ validation.passwordConfirmation }
                            error={ this.state.fields.passwordConfirmation.error }
                        />
                        
                        <div className="field is-grouped">
                            <div className="control">
                                <button disabled={ !this.state.formValid } className="button is-primary" type="submit">Submit</button>
                            </div>
                            <div className="control">
                                <Link className="button is-light" to="/users">Cancel</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        );
    }
}

const validation = {
    name: [validationRules.required],
    username: [validationRules.required],
    email: [validationRules.required],
    password: [validationRules.required, validationRules.password],
    passwordConfirmation: [validationRules.required, validationRules.passwordMatch]
};

const mapStateToProps = state => {
    return { error: state.usersReducer.error, message: state.usersReducer.message };
};

export default connect(mapStateToProps, { createUser })(UserNew);