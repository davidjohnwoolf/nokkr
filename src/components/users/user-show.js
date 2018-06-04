import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUser, deleteUser, clearUser } from '../../actions/users.action';
import { sendMessage, sendError } from '../../actions/flash.action';

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
        const { user } = this.props;
        
        if (!user) return;
        
        return (
            <main id="user-show" className="content">
                <section className="card">
                    <header>
                        <h1>
                            { user.name }
                        </h1>
                    </header>
                    <section>
                        <h4>Username</h4>
                        <address>{ user.username }</address>

                        <h4>Email</h4>
                        <address>{ user.email }</address>
                    </section>
                    
                    <footer>
                        <div className="btn-group">
                            <Link to={ `/users/${ this.props.match.params.id }/edit` } className="btn btn-primary">
                                <i className="far fa-edit icon-front"></i> Edit User
                            </Link>
                            <button onClick={ this.handleDelete } className="btn btn-danger">
                                <i className="fas fa-times icon-front"></i> Delete User
                            </button>
                        </div>
                    </footer>
                </section>
            </main>
        );
    }
    
    render() {
        
        return (
            <div className="component-page user-show">
                { this.renderUser() }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.users.user,
    message: state.users.message,
    id: state.auth.id
});

export default connect(mapStateToProps, { fetchUser, deleteUser, sendMessage, sendError, clearUser })(UserShow);