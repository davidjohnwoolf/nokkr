import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { required, requiredExceptAdmin, password, passwordMatch, validate } from '../helpers/validation';
import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';
import FieldCheckbox from '../forms/field-checkbox';
//import FieldFile from '../helpers/field-file';
import { createUser, clearUser } from '../../actions/users.action';
import { fetchTeams } from '../../actions/teams.action';
import { sendMessage } from '../../actions/flash.action';

import { ADMIN, MANAGER, USER } from '../../../lib/constants';
import { capitalize } from '../../../lib/functions';

class UserNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearUser();
        
        props.fetchTeams();
        
        this.validationRules = Object.freeze({
            firstName: [required],
            lastName: [required],
            username: [required],
            email: [required],
            role: [required],
            team: [requiredExceptAdmin],
            isReadOnly: [],
            isActive: [],
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
                isReadOnly: { checked: null, error: '' },
                isActive: { checked: 'true', error: '' },
                userImage: { value: '', error: '' },
                password: { value: '', error: '' },
                passwordConfirmation: { value: '', error: '' }
            },
            serverMessage: '',
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidUpdate() {
        const { success, fail, message, history, sendMessage } = this.props;
        
        //why are you using serverMessage as state when you have message?
        if (fail && (message !== this.state.serverMessage)) this.setState({ serverMessage: message });
        
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
        if (!this.props.teams) return null;
        
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
        
        this.props.teams.forEach(team => {
           teamOptions.push([team.title, team._id]); 
        });
        
        return (
                
            <main id="user-new" className="content">
                <section className="form">
                    <header className="content-header">
                        <a onClick={ this.props.history.goBack } href="#" className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
                        <h1>Create User</h1>
                    </header>
                    <small className="server-error">{ this.state.serverMessage }</small>
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
    teams: state.teams.teams
});

export default connect(mapStateToProps, { fetchTeams, clearUser, createUser, sendMessage })(UserNew);