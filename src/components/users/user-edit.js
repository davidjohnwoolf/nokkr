import React from 'react';
import { connect } from 'react-redux';

import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';
import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';
import FieldCheckbox from '../forms/field-checkbox';
import SubmitBlock from '../forms/submit-block';

import { fetchUsers, updateUser, clearUsers, deleteUser } from '../../actions/users.action';
import { fetchTeams } from '../../actions/teams.action';
import { sendMessage, sendError } from '../../actions/flash.action';

import { required, requiredExceptAdmin, password, passwordMatch, validate, unique, initializeForm, formSubmit } from '../helpers/forms';
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
            teamId: [requiredExceptAdmin],
            isReadOnly: [],
            isActive: [],
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
                teamId: { value: '', error: '' },
                isReadOnly: { checked: false, error: '' },
                isActive: { checked: true, error: '' },
                password: { value: '', error: '' },
                passwordConfirmation: { value: '', error: '' }
            },
            uniqueCandidateList: null,
            user: null,
            teamOptions: null,
            formValid: false,
            isLoading: true
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchUsers();
        this.props.fetchTeams();
    }

    componentDidUpdate() {
        const {
            props: {
                success,
                message,
                history,
                sendMessage,
                match: { params },
                users,
                teams,
                deleted
            },
            state: { fields, isLoading }
        } = this;
        
        if (users && teams && isLoading) {
            const teamOptions = [['Select Team', '']];
            
            const user = users.find(user => user._id === params.id);
        
            teams.forEach(team => teamOptions.push([team.title, team._id]));
            
            this.setState({
                isLoading: false,
                fields: initializeForm({ ...fields }, user),
                user,
                uniqueCandidateList: users,
                teamOptions
            });
        }
        
        if (success) {
            sendMessage(message);

            deleted ? history.push('/users') : history.push(`/users/${ params.id }`);
        }
    }
    
    handleDelete() {
        const { match: { params }, sessionId, sendError, deleteUser } = this.props;
        
        //update to check if user has leads etc
        if (params.id !== sessionId) {
            if (confirm('Are you sure you want to delete this user?  This is not reversible.')) {
                deleteUser(params.id);
            }
        } else {
            sendError('You cannot delete a user you are logged in as');
        }
    }
    
    handleUserInput(e) {
        const { validationRules, state: { fields, uniqueCandidateList, user } } = this;
        
        this.setState(
            validate(e, validationRules, { ...fields }, uniqueCandidateList, user)
        );
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const { state: { fields }, props: { updateUser, match: { params } } } = this;
        
        formSubmit({
            fields: { ...fields },
            excludeKeys: ['team', 'password', 'passwordConfirmation'],
            action: updateUser,
            id: params.id
        });
    }
    
    render() {
        const {
            props: { sessionId, history, match: { params } },
            state: {
                teamOptions,
                formValid,
                isLoading,
                fields: {
                    firstName,
                    lastName,
                    username,
                    email,
                    password,
                    passwordConfirmation,
                    role,
                    teamId,
                    isReadOnly,
                    isActive
                }
            },
            handleSubmit,
            handleUserInput,
            handleDelete
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="user-edit" className="content">
                <ContentHeader title="Edit User" history={ history } chilrenAccess={ true }>
                    <IconLink clickEvent={ handleDelete } type="danger" icon="trash-alt" />
                </ContentHeader>
                
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
                        name="teamId"
                        value={ teamId.value }
                        handleUserInput={ handleUserInput }
                        error={ teamId.error }
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
                        disabled={ sessionId === params.id }
                    />
                    <SubmitBlock formValid={ formValid } submitText="Update User" history={ history } />
                </form>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    message: state.users.message,
    success: state.users.success,
    deleted: state.users.deleted,
    users: state.users.users,
    sessionId: state.auth.sessionId,
    teams: state.teams.teams
});

export default connect(mapStateToProps, { clearUsers, updateUser, sendMessage, fetchTeams, fetchUsers, deleteUser, sendError })(UserEdit);