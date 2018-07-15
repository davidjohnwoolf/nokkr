import React from 'react';
import { connect } from 'react-redux';

import { required, unique, validate, formSubmit } from '../helpers/forms';

import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import FieldInput from '../forms/field-input';
import FieldCheckbox from '../forms/field-checkbox';
import SubmitBlock from '../forms/submit-block';

import { createTeam, clearTeams, fetchTeams } from '../../actions/teams.action';
import { sendMessage } from '../../actions/flash.action';

class TeamNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearTeams();
        
        this.validationRules = Object.freeze({
            title: [required, unique],
            notifySales: []
        });
        
        this.state = {
            fields: {
                title: { value: '', error: '' },
                notifySales: { checked: null, error: '' }
            },
            isLoading: true,
            uniqueCandidateList: [],
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchTeams();
    }
    
    componentDidUpdate() {
        const {
            props: { success, message, history, sendMessage, teamId, teams },
            state: { isLoading }
        } = this;
        
        if (teams && isLoading) {
            this.setState({
                isLoading: false,
                uniqueCandidateList: teams
            });
        }
        
        if (success) {
            sendMessage(message);
            history.push(`/teams/${ teamId }`);
        }
    }
    
    handleUserInput(e) {
        const { validationRules, state: { fields, uniqueCandidateList } } = this;

        this.setState(
            validate(e, validationRules, { ...fields }, uniqueCandidateList, null)
        );
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const { state: { fields }, props: { createTeam, match: { params } } } = this;
        
        formSubmit({ fields: { ...fields }, action: createTeam, id: params.id });
    }
    
    render() {
        const {
            props: { history },
            state: { fields: { title, notifySales }, formValid, isLoading },
            handleSubmit,
            handleUserInput
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
                
            <main id="team-new" className="content">
                <section className="form">
                    <ContentHeader title="Create Team" history={ history } />
                    
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

                        <SubmitBlock formValid={ formValid } submitText="Create Team" history={ history } />
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

export default connect(mapStateToProps, { clearTeams, createTeam, sendMessage, fetchTeams })(TeamNew);