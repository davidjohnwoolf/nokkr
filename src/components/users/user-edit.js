import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

import { required, requiredExceptAdmin, password, passwordMatch, validate } from '../helpers/validation';

import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';
import FieldCheckbox from '../forms/field-checkbox';

import { fetchUsers, fetchUser, updateUser, clearUser } from '../../actions/users.action';
import { fetchTeams } from '../../actions/teams.action';
import { sendMessage } from '../../actions/flash.action';

import { SU, ADMIN, MANAGER, USER, UNIQUE } from '../../../lib/constants';
import { capitalize } from '../../../lib/functions';

class UserEdit extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearUser();
        props.fetchUser(props.match.params.id);
        props.fetchUsers();
        props.fetchTeams();
        
        this.validationRules = Object.freeze({
            firstName: [required],
            lastName: [required],
            username: [required, UNIQUE],
            email: [required, UNIQUE],
            role: [required],
            team: [requiredExceptAdmin],
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
                team: { value: '', error: '' },
                isReadOnly: { checked: false, error: '' },
                isActive: { checked: true, error: '' },
                userImage: { value: '', error: '' },
                password: { value: '', error: '' },
                passwordConfirmation: { value: '', error: '' }
            },
            objects: [],
            formValid: false,
            hasInitialized: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        const { user, users } = nextProps;
        const { hasInitialized } = prevState;
        
        if (!hasInitialized && user && users) {
            const fields = { ...prevState.fields };
            
            for (let field in fields) {
                if (!field.includes('password')) fields[field].value = user[field];
            }
            
            return { objects: users, fields, hasInitialized: true };
            
        } else {
            return prevState;
        }
    }

    
    componentDidUpdate() {
        const { success, fail, message, history, sendMessage, match } = this.props;
        
        if (success) {
            sendMessage(message);
            history.push(`/users/${ match.params.id }`);
        }
    }
    
    handleUserInput(e) {
        
        this.setState(
            validate(e, this.validationRules, { ...this.state.fields }, this.state.objects)
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
        const { user, teams, history } = this.props;
        
        if (!teams || !user) return <section className="spinner"><i className="fas fa-spinner fa-spin"></i></section>;
        
        const { handleSubmit, handleUserInput, state } = this;
        const {
            firstName,
            lastName,
            username,
            email,
            password,
            passwordConfirmation,
            role,
            team,
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
        
        const teamOptions = [['Select Team', '']];
        
        teams.forEach(team => {
           teamOptions.push([team.title, team._id]); 
        });
        
        return (
                
            <main id="user-edit" className="content">
                <section className="form">
                    <header className="content-header">
                        <a onClick={ history.goBack } style={{ cursor: 'pointer' }} className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
                        <h1>Edit User</h1>
                    </header>
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
                        <FieldSelect
                            message="Optional for admin users"
                            name="team"
                            value={ team.value }
                            handleUserInput={ handleUserInput }
                            error={ team.error }
                            options={ teamOptions }
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
                                disabled={ !state.formValid }
                                className="btn btn-primary"
                                type="submit">
                                Submit
                            </button>
                            <a onClick={ history.goBack } style={{ cursor: 'pointer' }} className="btn btn-cancel">Cancel</a>
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
    users: state.users.users,
    teams: state.teams.teams
});

export default connect(mapStateToProps, { fetchUser, clearUser, updateUser, sendMessage, fetchTeams, fetchUsers })(UserEdit);