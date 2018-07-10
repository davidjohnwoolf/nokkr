import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUser, deleteUser, clearUser } from '../../actions/users.action';
import { sendMessage } from '../../actions/flash.action';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

class UserShow extends React.Component {
    
	constructor(props) {
        super(props);
        
        props.clearUser();
        props.fetchUser(props.match.params.id);
    }

    renderUser() {
        
        const { user, history, role, sessionId, sessionTeam, isReadOnly } = this.props;
        
        if (!user) return <section className="spinner"><i className="fas fa-spinner fa-spin"></i></section>;
        
        //authorization
        if ((role !== SU) && (role !== ADMIN) && ((role === MANAGER && user.team !== sessionTeam) || (role === USER && sessionId !== user._id))) {
            history.push('/not-authorized');
        }
        
        return (
            <main id="user-show" className="content">
                <section className="index">
                    <header className="content-header">
                        <a onClick={ history.goBack } style={{ cursor: 'pointer' }} className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
                        <h1>{ `${user.firstName} ${user.lastName}` }</h1>
                        { ((role === ADMIN || (role === SU)) && !isReadOnly)
                            ? <Link to={ `/users/${ this.props.match.params.id }/edit` } className="icon-button-primary"><i className="fas fa-edit"></i></Link>
                            : '' }
                    </header>
                    <section className="card">
                        <section>
                            <h4>Username</h4>
                            <address>{ user.username }</address>
    
                            <h4>Email</h4>
                            <address>{ user.email }</address>
                        </section>
                    </section>
                    <section className="index">
                        <h2>Upcoming Apts, Recent Leads etc.</h2>
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
    fetching: state.users.fetching,
    user: state.users.user,
    message: state.users.message,
    role: state.auth.role,
    isReadOnly: state.auth.isReadOnly,
    sessionTeam: state.auth.sessionTeam,
    sessionId: state.auth.sessionId
});

export default connect(mapStateToProps, { fetchUser, deleteUser, sendMessage, clearUser })(UserShow);