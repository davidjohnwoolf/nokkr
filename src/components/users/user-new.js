import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { required, password, passwordMatch, validate } from '../helpers/validation';
import FieldInput from '../helpers/field-input';
import FieldSelect from '../helpers/field-select';
import FieldCheckbox from '../helpers/field-checkbox';
import { createUser, clearUser } from '../../actions/users.action';
import { sendMessage } from '../../actions/flash.action';

import { ADMIN, MANAGER, USER } from '../../../controllers/helpers/api-variables';

class UserNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearUser();
        
        this.validationRules = {
            firstName: [required],
            lastName: [required],
            username: [required],
            email: [required],
            role: [required],
            isReadOnly: [],
            isActive: [],
            password: [required, password],
            passwordConfirmation: [required, passwordMatch]
        };
        
        this.state = {
            fields: {
                firstName: { value: '', error: '' },
                lastName: { value: '', error: '' },
                username: { value: '', error: '' },
                email: { value: '', error: '' },
                role: { value: '', error: '' },
                isReadOnly: { checked: null, error: '' },
                isActive: { checked: 'true', error: '' },
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
        
        this.props.createUser(userData);
    }
    
    render() {
        const { handleSubmit, handleUserInput } = this;
        const { firstName, lastName, username, email, password, passwordConfirmation, role, isReadOnly, isActive } = this.state.fields;
        
        function capitalize(s) {
            return s.charAt(0).toUpperCase() + s.slice(1)
        }
        
        const roleOptions = [
            ['Select Role', ''],
            [capitalize(ADMIN), ADMIN],
            [capitalize(MANAGER), MANAGER],
            [capitalize(USER), USER]
        ];
        
        return (
                
            <main id="user-new" className="content">
                <section className="form">
                    <h1>Create User</h1>
                    <small className="server-error">{ this.state.serverError }</small>
                    <form onSubmit={ handleSubmit }>
                    
                        <FieldInput
                            name="firstName"
                            type="text"
                            placeholder="first name"
                            value={ firstName.value }
                            handleUserInput={ handleUserInput }
                            error={ firstName.error }
                        />
                        <FieldInput
                            name="lastName"
                            type="text"
                            placeholder="last name"
                            value={ lastName.value }
                            handleUserInput={ handleUserInput }
                            error={ lastName.error }
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
                        <FieldSelect
                            name="role"
                            value={ role.value }
                            handleUserInput={ handleUserInput }
                            error={ role.error }
                            options={ roleOptions }
                        />
                        <FieldCheckbox
                            name="isReadOnly"
                            label="Read Only"
                            checked={ isReadOnly.checked }
                            value="true"
                            handleUserInput={ handleUserInput }
                            error={ isReadOnly.error }
                        />
                        <FieldCheckbox
                            name="isActive"
                            label="Active"
                            value="true"
                            checked={ isActive.checked }
                            handleUserInput={ handleUserInput }
                            error={ isActive.error }
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