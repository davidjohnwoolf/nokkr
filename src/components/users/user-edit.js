import React from 'react';
import { connect } from 'react-redux';

import Loading from '../layout/loading';
import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';
import FieldCheckbox from '../forms/field-checkbox';

import { fetchUsers, fetchUser, updateUser, clearUsers, deleteUser } from '../../actions/users.action';
import { fetchTeams } from '../../actions/teams.action';
import { sendMessage, sendError } from '../../actions/flash.action';

import { required, requiredExceptAdmin, password, passwordMatch, validate, unique, initializeForm } from '../helpers/forms';
import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';
import { capitalize } from '../../../lib/functions';

class UserEdit extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearUsers();
        
        this.validationRules = Object.freeze({
            firstName: [required],
            lastName: [required],
            username: [required, unique],
            email: [required, unique],
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
            uniqueCandidateList: null,
            teamOptions: null,
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    
    componentDidMount() {
        const { fetchUser, fetchUsers, fetchTeams, match } = this.props;
        
        fetchUser(match.params.id);
        fetchUsers();
        fetchTeams();
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        const { user, users } = nextProps;
        const { isInitialized } = prevState;
        
        if (!isInitialized && user && users) {
            const fields = { ...prevState.fields };
            
            return { uniqueCandidateList: users, fields: initializeForm(fields, user), isInitialized: true };

        } else {
            return prevState;
        }
    }

    
    componentDidUpdate() {
        const { success, message, history, sendMessage, match, user, users, teams } = this.props;
        const fields = { ...this.state.fields };
        
        if (users && teams && user && this.state.isLoading) {
            const teamOptions = [['Select Team', '']];
        
            teams.forEach(team => teamOptions.push([team.title, team._id]));
            
            this.setState({
                isLoading: false,
                fields: initializeForm(fields, user),
                uniqueCandidateList: users,
                teamOptions
            });
        }
        
        if (success) {
            sendMessage(message);
            
            //either deleted user or updated user based on user presence
            !user ? history.push('/users') : history.push(`/users/${ match.params.id }`);
        }
    }
    
    handleDelete() {
        const { match, sessionId, sendError, deleteUser } = this.props;
        
        if (match.params.id !== sessionId) {
            if (confirm('Are you sure you want to delete this user?  This is not reversible.')) {
                deleteUser(match.params.id);
            }
        } else {
            sendError('You cannot delete a user you are logged in as');
        }
    }
    
    handleUserInput(e) {
        
        this.setState(
            validate(e, this.validationRules, { ...this.state.fields }, this.state.uniqueCandidateList, this.props.user)
        );
    }
    
    handleSubmit(e) {
        
        e.preventDefault();
        
        const userData = { ...this.state.fields };
        
        //convert fields obj into user obj
        for (let key in userData) {
            let fieldType = ('checked' in userData[key]) ? 'checked' : 'value';
            
            //remove password if empty
            if ((key === 'password' || key === 'passwordConfirmation') && !userData[key].value) {
                delete userData[key];
            //remove team if empty
            } else if (key === 'team' && !userData[key][fieldType]) {
                delete userData[key];
            } else {
                userData[key] = userData[key][fieldType];
            }
        }
        
        this.props.updateUser(this.props.match.params.id, userData);
    }
    
    render() {
        if (this.state.isLoading) return <Loading />;
        
        const { handleSubmit, handleUserInput, handleDelete, state, props } = this;
        const { sessionId, history, match } = props;
        const { teamOptions, formValid } = state;
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
        
        return (
                
            <main id="user-edit" className="content">
                <header className="content-header">
                    <a onClick={ history.goBack } className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
                    <h1>Edit User</h1>
                    <a onClick={ handleDelete } className="icon-button-danger"><i className="fas fa-trash-alt"></i></a>
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
                        options={[
                            ['Select Role', ''],
                            [capitalize(ADMIN), ADMIN],
                            [capitalize(MANAGER), MANAGER],
                            [capitalize(USER), USER]
                        ]}
                    />
                    <FieldCheckbox
                        name="isReadOnly"
                        label="Read Only"
                        checked={ isReadOnly.checked }
                        value="true"
                        handleUserInput={ handleUserInput }
                        error={ isReadOnly.error }
                    />
                    <FieldSelect
                        message="Optional for admin users"
                        name="team"
                        value={ team.value }
                        handleUserInput={ handleUserInput }
                        error={ team.error }
                        options={ teamOptions }
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
                    <FieldCheckbox
                        name="isActive"
                        label="Active"
                        value="true"
                        checked={ isActive.checked }
                        handleUserInput={ handleUserInput }
                        error={ isActive.error }
                        disabled={ sessionId === match.params.id }
                    />
                    <div className="btn-group">
                        <button
                            disabled={ !formValid }
                            className="btn btn-primary"
                            type="submit">
                            Submit
                        </button>
                        <a onClick={ history.goBack } className="btn btn-cancel">Cancel</a>
                    </div>
                </form>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    message: state.users.message,
    success: state.users.success,
    user: state.users.user,
    users: state.users.users,
    sessionId: state.auth.sessionId,
    teams: state.teams.teams
});

export default connect(mapStateToProps, { fetchUser, clearUsers, updateUser, sendMessage, fetchTeams, fetchUsers, deleteUser, sendError })(UserEdit);