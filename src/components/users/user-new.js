import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { required, requiredExceptAdmin, password, passwordMatch, validate } from '../helpers/forms';
import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';
import FieldCheckbox from '../forms/field-checkbox';
//import FieldFile from '../helpers/field-file';
import { createUser, clearUser, fetchUsers } from '../../actions/users.action';
import { fetchTeams } from '../../actions/teams.action';
import { sendMessage } from '../../actions/flash.action';

import { ADMIN, MANAGER, USER, UNIQUE } from '../../../lib/constants';
import { capitalize } from '../../../lib/functions';

class UserNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearUser();
        
        props.fetchTeams();
        props.fetchUsers();
        
        this.validationRules = Object.freeze({
            firstName: [required],
            lastName: [required],
            username: [required, UNIQUE],
            email: [required, UNIQUE],
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
            isInitialized: false,
            uniqueCandidateList: [],
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        const { users } = nextProps;
        const { isInitialized } = prevState;
        
        if (!isInitialized && users) {
            
            return { uniqueCandidateList: users, isInitialized: true };
            
        } else {
            return prevState;
        }
    }
    
    componentDidUpdate() {
        const { success, message, history, sendMessage, userId } = this.props;
        
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

            if ('value' in userData[key]) {
                userData[key] = userData[key].value;
            } else if ('checked' in userData[key]) {
                userData[key] = userData[key].checked;
            }
        }
        
        this.props.createUser(userData);
    }
    
    render() {
        const { teams, users, history } = this.props;
        
        if (!teams || !users) return <section className="spinner"><i className="fas fa-spinner fa-spin"></i></section>;
        
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
                
            <main id="user-new" className="content">
                <section className="form">
                    <header className="content-header">
                        <a onClick={ history.goBack } style={{ cursor: 'pointer' }} className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
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
                        { /*<FieldFile
                            name="userImage"
                            label="Upload User Image"
                            value={ userImage.value }
                            handleUserInput={ handleUserInput }
                            error={ userImage.error } 
                        />*/ }
                        
                        <div className="btn-group">
                            <button
                                disabled={ !this.state.formValid }
                                className="btn btn-primary"
                                type="submit">
                                Submit
                            </button>
                            <a onClick={ this.props.history.goBack } style={{ cursor: 'pointer' }} className="btn btn-cancel">Cancel</a>
                        </div>
                    </form>
                </section>
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

export default connect(mapStateToProps, { fetchTeams, fetchUsers, clearUser, createUser, sendMessage })(UserNew);