import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';

import { fetchTeam, clearTeams } from '../../actions/teams.action';
import { sendMessage } from '../../actions/flash.action';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

class TeamShow extends React.Component {
    
	constructor(props) {
        super(props);
        
        props.clearTeams();
        
        this.state = {
            isLoading: true
        }
    }
    
    componentDidMount() {
        this.props.fetchTeam(this.props.match.params.id);
    }
    
    componentDidUpdate() {
        const { props: { team }, state: { isLoading } } = this;
        
        if (team && isLoading) this.setState({ isLoading: false });
    }
    
    renderUsers() {
        const { team } = this.props;
        
        const teamManagers = [];
        const teamUsers = [];
        
        team.users.forEach(user => {
            if (user.isActive) {
                (user.role === MANAGER) || (user.role === ADMIN)
                    ? teamManagers.push(user)
                    : teamUsers.push(user);
            }
        });

        return (
            <div className="users-list">
                <h3>Managers</h3>
                <ul className="link-list">
                    { teamManagers.map(user => {
                        return (
                            <li key={ user._id }><Link to={ `/users/${ user._id }` }>{ user.firstName } { user.lastName }</Link></li>
                        );
                    }) }
                </ul>
                <h3>Users</h3>
                <ul className="link-list">
                    { teamUsers.map(user => {
                        return (
                            <li key={ user._id }><Link to={ `/users/${ user._id }` }>{ user.firstName } { user.lastName }</Link></li>
                        );
                    }) }
                </ul>
            </div>
        );
    }
    
    render() {
        
        const {
            props: { history, team, match: { params }, role, sessionTeam, isReadOnly },
            state: { isLoading }
        } = this;
        
        if (isLoading) return <Loading />;
        
        //authorization
        if ((role !== SU) && (role !== ADMIN) && (sessionTeam !== team._id)) {
            history.push('/not-authorized');
        }
        
        return (
            <main id="team-show" className="content">
                
                <ContentHeader title={ team.title } history={ history } chilrenAccess={ (role !== MANAGER) && !isReadOnly }>
                    <IconLink url={ `/teams/${ params.id }/edit` } icon="edit" />
                </ContentHeader>
                
                <section className="card">
                    <section>
                        <h4>Title</h4>
                        <address>{ team.title }</address>

                        <h4>Notify Sales</h4>
                        <address>{ team.notifySales ? 'On' : 'Off' }</address>
                    </section>
                </section>

                { this.renderUsers() }
                
                <h2>Upcoming Appointments, Recent Leads</h2>

            </main>
        );
    }
}

const mapStateToProps = state => ({
    team: state.teams.team,
    role: state.auth.role,
    isReadOnly: state.auth.isReadOnly,
    sessionTeam: state.auth.sessionTeam
});

export default connect(mapStateToProps, { fetchTeam, sendMessage, clearTeams })(TeamShow);