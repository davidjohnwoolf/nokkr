import React from 'react';
import { connect } from 'react-redux';

import { required, validate } from '../helpers/validation';
import FieldInput from '../forms/field-input';
import FieldCheckbox from '../forms/field-checkbox';

import { fetchTeam, updateTeam, clearTeam } from '../../actions/teams.action';
import { sendMessage } from '../../actions/flash.action';

class TeamEdit extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearTeam();
        props.fetchTeam(props.match.params.id);
        
        this.validationRules = Object.freeze({
            title: [required],
            notifySales: []
        });
        
        this.state = {
            fields: {
                title: { value: '', error: '' },
                notifySales: { checked: false, error: '' }
            },
            serverMessage: '',
            formValid: false,
            hasInitialized: false
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
            history.push('/teams');
        }
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        const { team } = nextProps;
        const { hasInitialized } = prevState;
        
        if (!hasInitialized && team) {
            const fields = { ...prevState.fields };

            fields.title.value = team.title;
            fields.notifySales.checked = team.notifySales;
            
            return { fields, hasInitialized: true };
            
        } else {
            return prevState;
        }
    }
    
    handleUserInput(e) {

        this.setState(
            validate(e, this.validationRules, { ...this.state.fields })
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
        
        this.props.updateTeam(this.props.match.params.id, teamData);
    }
    
    render() {
        if (!this.props.team) return <section className="spinner"><i className="fas fa-spinner fa-spin"></i></section>;
        
        const { handleSubmit, handleUserInput, state } = this;
        const { title, notifySales } = state.fields;
        
        return (
                
            <main id="team-new" className="content">
                <section className="form">
                    <header className="content-header">
                        <a onClick={ this.props.history.goBack } href="#" className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
                        <h1>Edit Team</h1>
                    </header>
                    <small className="server-error">{ this.state.serverMessage }</small>
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
                            <a onClick={ this.props.history.goBack } href="#" className="btn btn-cancel">Cancel</a>
                        </div>
                    </form>
                </section>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    team: state.teams.team,
    message: state.teams.message,
    success: state.teams.success,
    fail: state.teams.fail
});

export default connect(mapStateToProps, { clearTeam, fetchTeam, updateTeam, sendMessage })(TeamEdit);