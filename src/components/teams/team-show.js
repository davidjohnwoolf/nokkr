import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTeam, deleteTeam, clearTeam } from '../../actions/teams.action';
import { sendMessage, sendError } from '../../actions/flash.action';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

class TeamShow extends React.Component {
    
	constructor(props) {
        super(props);
        
        props.clearTeam();
        props.fetchTeam(props.match.params.id);
        
        this.handleDelete = this.handleDelete.bind(this);
    }
    
    componentDidUpdate() {
        const { message, history, sendMessage } = this.props;
        
        if (message === 'Team deleted') {
            sendMessage(message);
            history.push('/teams');
        }
    }
    
    handleDelete() {
        const { match, sendError, deleteTeam, userTeam } = this.props;
        
        if (match.params.id !== userTeam) {
            if (confirm('Are you sure you want to delete this Team?  This is not reversible.')) {
                deleteTeam(match.params.id);
            }
        } else {
            sendError('You cannot delete a team you are a member of');
        }
    }
    
    renderUser() {
        const {role, history, userTeam, team, match, isReadOnly } = this.props;
        
        if (!team) return;
        
        //authorization
        if ((role !== SU) && (role !== ADMIN) && (userTeam !== team._id)) {
            history.push('/not-authorized');
        }
        
        return (
            <main id="team-show" className="content">
                <section className="index">
                    <header className="content-header">
                        <a onClick={ history.goBack } href="#" className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
                        <h1>{ team.title }</h1>
                        <Link to={ `/teams/${ match.params.id }/edit` } className="icon-button-primary"><i className="fas fa-edit"></i></Link>
                    </header>
                    <section className="card">
                        <section>
                            <h4>Title</h4>
                            <address>{ team.title }</address>
    
                            <h4>Notify Sales</h4>
                            <address>{ team.notifySales ? 'On' : 'Off' }</address>
                        </section>
                    </section>
                    <section className="index">
                        <h2>Team managers and users</h2>
                        { !isReadOnly
                            ? <button onClick={ this.handleDelete } className="btn btn-danger"><i className="fas fa-times icon-front"></i> Delete Team</button>
                            : '' }
                    </section>
                </section>
            </main>
        );
    }
    
    render() {
        
        return (
            <div className="component-page">
                { this.renderUser() }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    team: state.teams.team,
    message: state.teams.message,
    role: state.auth.role,
    userTeam: state.auth.team,
});

export default connect(mapStateToProps, { fetchTeam, deleteTeam, sendMessage, sendError, clearTeam })(TeamShow);