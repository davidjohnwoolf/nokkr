import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import validationRules from '../../helpers/validation-rules';
import Field from '../forms/field';
import { createUser } from '../../actions/users';

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
        
        //handle all rules
        for (let key in validation ) {
            validation[key].forEach(rule => {
                //make this more functional if possible, less reliant on html
                if (rule(document.querySelector(`input[name=${ key }`).value)) formValid = false;
            });
        }
        
        //handle target rules
        rules.forEach(rule => {
            let result = rule(e.target.value);
            
            if (result) error = result;

            fields[e.target.name].error = error;
        });
        
        console.log()

        fields[e.target.name].value = e.target.value;
        this.setState({ fields, formValid });
    }
    
    handleSubmit(e) {
        //set rules
        
        e.preventDefault();
        
        const userData = { ...this.state.fields };
        
        for (let key in userData) {
            userData[key] = userData[key].value;
        }
        
        this.props.createUser({ ...userData });
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

//is this the right place for this?
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