import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

import { required, password, passwordMatch, validate } from '../helpers/validation';

import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';
import FieldCheckbox from '../forms/field-checkbox';

import { fetchUser, updateUser, clearUser } from '../../actions/users.action';
import { sendMessage } from '../../actions/flash.action';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';
import { capitalize } from '../../../lib/functions';

class UserEdit extends React.Component {
    
    constructor(props) {
        super(props);
        
        const { user, role, id } = this.props;
        
        //authorization
        if ((role !== SU) && (role !== ADMIN) && (id !== user._id)) {
            props.history.push('/not-authorized');
        }
        
        props.clearUser();
        props.fetchUser(props.match.params.id);
        
        this.validationRules = Object.freeze({
            firstName: [required],
            lastName: [required],
            username: [required],
            email: [required],
            role: [required],
            isReadOnly: [],
            isActive: [],
            userImage: [],
            password: [password],
            passwordConfirmation: [passwordMatch]
        });

        this.state = {
            fields: {
                firstName: { value: '', error: '' },
                lastName: { value: '', error: '' },
                username: { value: '', error: '' },
                email: { value: '', error: '' },
                role: { value: '', error: '' },
                isReadOnly: { checked: false, error: '' },
                isActive: { checked: true, error: '' },
                userImage: { value: '', error: '' },
                password: { value: '', error: '' },
                passwordConfirmation: { value: '', error: '' }
            },
            serverError: '',
            formValid: false,
            hasInitialized: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        const { user } = nextProps;
        const { hasInitialized } = prevState;
        
        if (!hasInitialized && user) {
            const fields = { ...prevState.fields };

            fields.firstName.value = user.firstName;
            fields.lastName.value = user.lastName;
            fields.username.value = user.username;
            fields.email.value = user.email;
            fields.role.value = user.role;
            fields.isActive.checked = user.isActive;
            fields.isReadOnly.checked = user.isReadOnly;
            
            return { fields, hasInitialized: true };
            
        } else {
            return prevState;
        }
    }

    
    componentDidUpdate() {
        const { success, fail, message, history, sendMessage, match } = this.props;
        
        if (fail && (message !== this.state.serverError)) this.setState({ serverError: message });
        
        if (success) {
            sendMessage(message);
            history.push(`/users/${ match.params.id }`);
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
        
        //convert fields obj into user obj
        for (let key in userData) {
            
            if (key === 'password' || key === 'passwordConfirmation') {
                //remove password if empty
                if (!userData[key].value) delete userData[key];
            } else if ('value' in userData[key]) {
                userData[key] = userData[key].value;
            } else if ('checked' in userData[key]) {
                userData[key] = userData[key].checked;
            }
        }
        
        this.props.updateUser(this.props.match.params.id, userData);
    }
    
    render() {
        const { handleSubmit, handleUserInput, state } = this;
        const {
            firstName,
            lastName,
            username,
            email,
            password,
            passwordConfirmation,
            role,
            isReadOnly,
            isActive,
            //userImage
        } = state.fields;
        
        const roleOptions = [
            ['Select Role', ''],
            [capitalize(ADMIN), ADMIN],
            [capitalize(MANAGER), MANAGER],
            [capitalize(USER), USER]
        ];
        
        return (
                
            <main id="user-edit" className="content">
                <section className="form">
                    <header className="content-header">
                        <a onClick={ this.props.history.goBack } href="#" className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
                        <h1>Edit User</h1>
                    </header>
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
                            message="If staying the same, leave password fields blank"
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
                            <a onClick={ this.props.history.goBack } href="#" className="btn btn-cancel">Cancel</a>
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
    fail: state.users.fail,
    user: state.users.user,
    role: state.auth.role,
    id: state.auth.id
});

export default connect(mapStateToProps, { fetchUser, clearUser, updateUser, sendMessage })(UserEdit);