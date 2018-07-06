import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUser, deleteUser, clearUser } from '../../actions/users.action';
import { sendMessage, sendError } from '../../actions/flash.action';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

class UserShow extends React.Component {
    
	constructor(props) {
        super(props);
        
        props.clearUser();
        props.fetchUser(props.match.params.id);
        
        this.handleDelete = this.handleDelete.bind(this);
    }
    
    componentDidUpdate() {
        const { message, history, sendMessage } = this.props;
        
        if (message === 'User deleted') {
            sendMessage(message);
            history.push('/users');
        }
    }
    
    handleDelete() {
        const { match, id, sendError, deleteUser } = this.props;
        
        if (match.params.id !== id) {
            if (confirm('Are you sure you want to delete this user?  This is not reversible.')) {
                deleteUser(match.params.id);
            }
        } else {
            sendError('You cannot delete a user you are logged in as');
        }
    }
    
    renderUser() {
        
        const { user, history, role, id, team } = this.props;
        
        if (!user) return <section className="spinner"><i className="fas fa-spinner fa-spin"></i></section>;
        
        //authorization
        if ((role !== SU) && (role !== ADMIN) && ((role === MANAGER && user.team !== team) || (role === USER && id !== user._id))) {
            history.push('/not-authorized');
        }
        
        return (
            <main id="user-show" className="content">
                <section className="index">
                    <header className="content-header">
                        <a onClick={ history.goBack } style={{ cursor: 'pointer' }} className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
                        <h1>{ `${user.firstName} ${user.lastName}` }</h1>
                        { (role === ADMIN || (role === SU))
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
                        <button onClick={ this.handleDelete } className="btn btn-danger">
                            <i className="fas fa-times icon-front"></i> Delete User
                        </button>
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
    team: state.auth.team,
    id: state.auth.role
});

export default connect(mapStateToProps, { fetchUser, deleteUser, sendMessage, sendError, clearUser })(UserShow);