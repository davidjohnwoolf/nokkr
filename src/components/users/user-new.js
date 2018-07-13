import React from 'react';
import { connect } from 'react-redux';

import Loading from '../layout/loading';
import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';
import FieldCheckbox from '../forms/field-checkbox';

import { createUser, clearUsers, fetchUsers } from '../../actions/users.action';
import { fetchTeams } from '../../actions/teams.action';
import { sendMessage } from '../../actions/flash.action';

import { required, requiredExceptAdmin, password, passwordMatch, unique, validate } from '../helpers/forms';
import { ADMIN, MANAGER, USER } from '../../../lib/constants';
import { capitalize } from '../../../lib/functions';

class UserNew extends React.Component {
    
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
            userImage: [],
            password: [required, password],
            passwordConfirmation: [required, passwordMatch]
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
                userImage: { value: '', error: '' },
                password: { value: '', error: '' },
                passwordConfirmation: { value: '', error: '' }
            },
            isLoading: true,
            teamOptions: null,
            uniqueCandidateList: null,
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchUsers();
        this.props.fetchTeams();
    }
    
    componentDidUpdate() {
        const { success, message, history, sendMessage, userId, users, teams } = this.props;
        
        if (users && teams && this.state.isLoading) {
            const teamOptions = [['Select Team', '']];
        
            teams.forEach(team => teamOptions.push([team.title, team._id]));
            
            this.setState({
                isLoading: false,
                uniqueCandidateList: users,
                teamOptions
            });
        }
        
        if (success) {
            sendMessage(message);
            history.push(`/users/${ userId }`);
        }
    }
    
    handleUserInput(e) {
        this.setState(
            validate(e, this.validationRules, { ...this.state.fields }, this.state.uniqueCandidateList, null)
        );
    }
    
    handleSubmit(e) {
        
        e.preventDefault();
        
        const userData = { ...this.state.fields };
        
        //convert fields obj into user obj
        for (let key in userData) {
            let fieldType = ('checked' in userData[key]) ? 'checked' : 'value';
            
            //if no team, remove team
            if (key === 'team' && !userData[key][fieldType]) {
                delete userData[key];
            } else {
                userData[key] = userData[key][fieldType];
            }
        }
        
        this.props.createUser(userData);
    }
    
    render() {
        if (this.state.isLoading) return <Loading />;
        
        const { handleSubmit, handleUserInput, props } = this;
        const { teamOptions, formValid } = this.state;
        const { history } = props;
        const {
            firstName,
            lastName,
            username,
            email,
            password,
            passwordConfirmation,
            role,
            team,
            isReadOnly
        } = this.state.fields;
        
        return (
                
            <main id="user-new" className="content">
                <header className="content-header">
                    <a onClick={ history.goBack } className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
                    <h1>Create User</h1>
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
    userId: state.users.userId,
    success: state.users.success,
    users: state.users.users,
    teams: state.teams.teams
});

export default connect(mapStateToProps, { fetchTeams, fetchUsers, clearUsers, createUser, sendMessage })(UserNew);