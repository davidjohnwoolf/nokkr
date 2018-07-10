import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchTeam, clearTeam } from '../../actions/teams.action';
import { fetchUsers } from '../../actions/users.action';
import { sendMessage, sendError } from '../../actions/flash.action';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

class TeamShow extends React.Component {
    
	constructor(props) {
        super(props);
        
        props.clearTeam();
        props.fetchTeam(props.match.params.id);
        props.fetchUsers();
    }
    
    renderUsers() {
        const { users, team } = this.props;
        
        const teamManagers = [];
        const teamUsers = [];
        
        users.forEach(user => {
            if (user.role === MANAGER || user.role === ADMIN) {
                teamManagers.push(user);
            } else {
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
        
        const { history, team, match, role, sessionTeam, isReadOnly, users } = this.props;
        
        if (!team || !users) return <section className="spinner"><i className="fas fa-spinner fa-spin"></i></section>;
        
        //authorization
        if ((role !== SU) && (role !== ADMIN) && (sessionTeam !== team._id)) {
            history.push('/not-authorized');
        }
        
        return (
            <div className="component-page">
                <main id="team-show" className="content">
                    <section className="index">
                        <div className="teams-list">
                            <header className="content-header">
                                <a onClick={ history.goBack } href="#" className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
                                <h1>{ team.title }</h1>
                                { role !== MANAGER && !isReadOnly
                                    ? <Link to={ `/teams/${ match.params.id }/edit` } className="icon-button-primary"><i className="fas fa-edit"></i></Link>
                                    : '' }
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
                        
                        { this.renderUsers() }
                        
                        <h2>Upcoming Appointments, Recent Leads</h2>
                        
                    </section>
                </main>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    team: state.teams.team,
    role: state.auth.role,
    isReadOnly: state.auth.isReadOnly,
    users: state.users.users,
    sessionTeam: state.auth.sessionTeam
});

export default connect(mapStateToProps, { fetchTeam, sendMessage, sendError, clearTeam, fetchUsers })(TeamShow);