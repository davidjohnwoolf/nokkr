import React from 'react';
import { connect } from 'react-redux';

import { required, unique, validate, initializeForm, formSubmit } from '../helpers/forms';

import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';
import FieldInput from '../forms/field-input';
import FieldCheckbox from '../forms/field-checkbox';
import SubmitBlock from '../forms/submit-block';

import { fetchTeams, updateTeam, clearTeams, deleteTeam } from '../../actions/teams.action';
import { sendMessage, sendError } from '../../actions/flash.action';

class TeamEdit extends React.Component {
    
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
                notifySales: { checked: false, error: '' }
            },
            isLoading: true,
            formValid: false,
            team: null,
            uniqueCandidateList: []
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    
    componentDidMount() {
        const { fetchTeams, match: { params } } = this.props;
        
        fetchTeams();
    }
    
    componentDidUpdate() {
        const {
            props: { success, deleted, message, history, sendMessage, match: { params }, teams },
            state: { isLoading, fields }
        } = this;
        
        if (teams && isLoading) {
            const team = teams.find(team => team._id === params.id);
            
            this.setState({
                isLoading: false,
                team,
                fields: initializeForm({ ...fields }, team),
                uniqueCandidateList: teams
            });
        }
        
        if (success) {
            sendMessage(message);

            deleted ? history.push('/teams') : history.push(`/teams/${ params.id }`);
        }
    }
    
    handleUserInput(e) {
        const { validationRules, state: { fields, uniqueCandidateList, team } } = this;

        this.setState(
            validate(e, validationRules, { ...fields }, uniqueCandidateList, team)
        );
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const { state: { fields }, props: { updateTeam, match: { params } } } = this;
        
        formSubmit({ fields: { ...fields }, action: updateTeam, id: params.id });
    }
    
    handleDelete() {
        const { match: { params }, sendError, deleteTeam, team } = this.props;
        
        if (!team.users.length) {
            if (confirm('Are you sure you want to delete this Team? This is not reversible.')) {
                deleteTeam(params.id);
            }
        } else {
            sendError('You cannot delete a team that has members, first update member teams');
        }
    }
    
    render() {
        const {
            props: { isReadOnly, history },
            state: {
                formValid,
                isLoading,
                fields: { title, notifySales }
            },
            handleSubmit,
            handleUserInput,
            handleDelete
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
                
            <main id="team-edit" className="content">
                <ContentHeader title="Edit Team" history={ history } chilrenAccess={ true }>
                    <IconLink clickEvent={ handleDelete } type="danger" icon="trash-alt" />
                </ContentHeader>
                
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
                    
                    <SubmitBlock formValid={ formValid } submitText="Update Team" history={ history } />
                </form>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    team: state.teams.team,
    teams: state.teams.teams,
    deleted: state.teams.deleted,
    message: state.teams.message,
    isReadOnly: state.auth.isReadOnly,
    success: state.teams.success
});

export default connect(mapStateToProps, { clearTeams, fetchTeams, updateTeam, sendMessage, deleteTeam, sendError })(TeamEdit);