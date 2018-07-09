import React from 'react';
import { connect } from 'react-redux';

import { required, unique, validate } from '../helpers/forms';
import FieldInput from '../forms/field-input';
import FieldCheckbox from '../forms/field-checkbox';

import { createTeam, clearTeam, fetchTeams } from '../../actions/teams.action';
import { sendMessage } from '../../actions/flash.action';

class TeamNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearTeam();
        props.fetchTeams();
        
        this.validationRules = Object.freeze({
            title: [required, unique],
            notifySales: []
        });
        
        this.state = {
            fields: {
                title: { value: '', error: '' },
                notifySales: { checked: null, error: '' }
            },
            isInitialized: false,
            uniqueCandidateList: [],
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        const { teams } = nextProps;
        const { isInitialized } = prevState;
        
        if (!isInitialized && teams) {
            
            return { uniqueCandidateList: teams, isInitialized: true };
            
        } else {
            return prevState;
        }
    }
    
    componentDidUpdate() {
        const { success, message, history, sendMessage, teamId } = this.props;
        
        if (success) {
            sendMessage(message);
            history.push(`/teams/${ teamId }`);
        }
    }
    
    handleUserInput(e) {

        this.setState(
            validate(e, this.validationRules, { ...this.state.fields }, this.state.uniqueCandidateList, null)
        );
    }
    
    handleSubmit(e) {
        
        e.preventDefault();
        
        const teamData = { ...this.state.fields };
        
        //convert fields obj into team obj
        for (let key in teamData) {

            if ('value' in teamData[key]) {
                teamData[key] = teamData[key].value;
            } else if ('checked' in teamData[key]) {
                teamData[key] = teamData[key].checked;
            }
        }
        
        this.props.createTeam(teamData);
    }
    
    render() {
        const { teams, history } = this.props;
        
        if (!teams) return <section className="spinner"><i className="fas fa-spinner fa-spin"></i></section>;
        
        const { handleSubmit, handleUserInput, state } = this;
        const { title, notifySales } = state.fields;
        
        return (
                
            <main id="team-new" className="content">
                <section className="form">
                    <header className="content-header">
                        <a onClick={ history.goBack } style={{ cursor: 'pointer' }} className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
                        <h1>Create Team</h1>
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
    teamId: state.teams.teamId,
    teams: state.teams.teams,
    message: state.teams.message,
    success: state.teams.success
});

export default connect(mapStateToProps, { clearTeam, createTeam, sendMessage, fetchTeams })(TeamNew);