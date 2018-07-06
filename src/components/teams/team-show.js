import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTeam, deleteTeam, clearTeam } from '../../actions/teams.action';
import { fetchUsers } from '../../actions/users.action';
import { sendMessage, sendError } from '../../actions/flash.action';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

class TeamShow extends React.Component {
    
	constructor(props) {
        super(props);
        
        props.clearTeam();
        props.fetchTeam(props.match.params.id);
        props.fetchUsers();
        
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
        const { match, sendError, deleteTeam, users } = this.props;
        
        if (users) sendError('You cannot delete a team that has members, first update member teams');

        if (confirm('Are you sure you want to delete this Team? This is not reversible.')) {
            deleteTeam(match.params.id);
        }
    }
    
    renderTeam() {
        const { history, team, match } = this.props;
        
        return (
            
            <div className="users-list">
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
            </div>
        );
    }
    
    renderUsers() {
        const { users, team } = this.props;
        
        const teamManagers = [];
        const teamUsers = [];
        
        users.forEach(user => {
            if (user.role === MANAGER && user.team === team._id) {
                teamManagers.push(user);
            } else if (user.team === team._id) {
                teamUsers.push(user);
            }
        });

        return (
            <div className="users-list">
                <h2>Managers</h2>
                <ul className="link-list">
                    { teamManagers.map(user => {
                        return (
                            <li key={ user._id }><Link to={ `/users/${ user._id }` }>{ `${ user.firstName } ${ user.lastName }` }</Link></li>
                        );
                    }) }
                </ul>
                <h2>Users</h2>
                <ul className="link-list">
                    { teamUsers.map(user => {
                        return (
                            <li key={ user._id }><Link to={ `/users/${ user._id }` }>{ `${ user.firstName } ${ user.lastName }` }</Link></li>
                        );
                    }) }
                </ul>
            </div>
        );
    }
    
    render() {
        
        if (!this.props.team || !this.props.users) return <section className="spinner"><i className="fas fa-spinner fa-spin"></i></section>;
        
        //authorization
        if ((this.props.role !== SU) && (this.props.role !== ADMIN) && (this.props.userTeam !== this.props.team._id)) {
            this.props.history.push('/not-authorized');
        }
        
        return (
            <div className="component-page">
                <main id="team-show" className="content">
                    <section className="index">
                        { this.renderTeam() }
                        { this.renderUsers() }
                    
                    
                        <h2>Upcoming Appointments, Recent Leads</h2>
                        { !this.props.isReadOnly
                            ? <button onClick={ this.handleDelete } className="btn btn-danger"><i className="fas fa-times icon-front"></i> Delete Team</button>
                            : '' }
                    </section>
                </main>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    team: state.teams.team,
    message: state.teams.message,
    role: state.auth.role,
    users: state.users.users,
    userTeam: state.auth.team
});

export default connect(mapStateToProps, { fetchUsers, fetchTeam, deleteTeam, sendMessage, sendError, clearTeam })(TeamShow);