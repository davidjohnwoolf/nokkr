import React from 'react';
import { connect } from 'react-redux';

import { required, unique, validate, initializeForm } from '../helpers/forms';
import FieldInput from '../forms/field-input';
import FieldCheckbox from '../forms/field-checkbox';

import { fetchTeam, fetchTeams, updateTeam, clearTeam, deleteTeam } from '../../actions/teams.action';
import { fetchUsers } from '../../actions/users.action';
import { sendMessage, sendError } from '../../actions/flash.action';

class TeamEdit extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearTeam();
        props.fetchTeam(props.match.params.id);
        props.fetchTeams();
        props.fetchUsers();
        
        this.validationRules = Object.freeze({
            title: [required, unique],
            notifySales: []
        });
        
        this.state = {
            fields: {
                title: { value: '', error: '' },
                notifySales: { checked: false, error: '' }
            },
            serverMessage: '',
            formValid: false,
            uniqueCandidateList: [],
            isInitialized: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    
    componentDidUpdate() {
        const { success, message, history, sendMessage, match, team } = this.props;
        
        if (success) {
            sendMessage(message);
            
            if (!team) {
                //team deleted
                history.push('/teams');
            } else {
                //team updated
                history.push(`/teams/${ match.params.id }`);
            }
        }
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        const { team, teams } = nextProps;
        const { isInitialized } = prevState;
        
        if (!isInitialized && team && teams) {
            const fields = { ...prevState.fields };
            
            return { uniqueCandidateList: teams, fields: initializeForm(fields, team), isInitialized: true };

        } else {
            return prevState;
        }
    }
    
    handleUserInput(e) {

        this.setState(
            validate(e, this.validationRules, { ...this.state.fields }, this.state.uniqueCandidateList, this.props.team)
        );
    }
    
    handleSubmit(e) {
        
        e.preventDefault();
        
        const teamData = { ...this.state.fields };
        
        //convert fields obj into team obj
        for (let key in teamData) {
            let fieldType = ('checked' in teamData[key]) ? 'checked' : 'value';

            teamData[key] = teamData[key][fieldType];
        }
        
        this.props.updateTeam(this.props.match.params.id, teamData);
    }
    
    handleDelete() {
        const { match, sendError, deleteTeam, users, team } = this.props;
        
        let teamHasUsers = false;
        
        users.forEach(user => {
            if (user.team === team._id) teamHasUsers = true;
        });
        
        if (!teamHasUsers) {
            if (confirm('Are you sure you want to delete this Team? This is not reversible.')) {
                deleteTeam(match.params.id);
            }
        } else {
            sendError('You cannot delete a team that has members, first update member teams');
        }
    }
    
    render() {
        const { team, teams, users, isReadOnly, history } = this.props;
        
        if (!team || !teams || !users) return <section className="spinner"><i className="fas fa-spinner fa-spin"></i></section>;
        
        const { handleSubmit, handleUserInput, state, handleDelete } = this;
        const { title, notifySales } = state.fields;
        
        return (
                
            <main id="team-new" className="content">
                <section className="form">
                    <header className="content-header">
                        <a onClick={ history.goBack } href="#" className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
                        <h1>Edit Team</h1>
                        { !isReadOnly
                            ? <a onClick={ handleDelete } style={{ cursor: 'pointer' }} className="icon-button-danger"><i className="fas fa-trash-alt"></i></a>
                            : '' }
                    </header>
                    <form onSubmit={ handleSubmit }>
                    
                        <FieldInput
                            name="title"
                            type="text"
                            placeholder="team name"
                            value={ title.value }
                            handleUserInput={ handleUserInput }
                            error={ title.error }
                        />
                        <FieldCheckbox
                            name="notifySales"
                            label="Notify Team on Sale"
                            checked={ notifySales.checked }
                            value="true"
                            handleUserInput={ handleUserInput }
                            error={ notifySales.error }
                        />
                        
                        <div className="btn-group">
                            <button
                                disabled={ !this.state.formValid }
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
    team: state.teams.team,
    teams: state.teams.teams,
    users: state.users.users,
    message: state.teams.message,
    isReadOnly: state.auth.isReadOnly,
    success: state.teams.success
});

export default connect(mapStateToProps, { clearTeam, fetchTeam, fetchTeams, updateTeam, sendMessage, deleteTeam, fetchUsers, sendError })(TeamEdit);