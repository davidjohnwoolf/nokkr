import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUser, deleteUser, clearUserMessages } from '../../actions/users';
import { sendMessage } from '../../actions/flash-messages';

class UserShow extends React.Component {
    
	constructor(props) {
        super(props);
        
        props.clearUserMessages();
        props.fetchUser(this.props.match.params.id);
        
        this.handleDelete = this.handleDelete.bind(this);
    }
    
    componentDidUpdate() {
        const { successMessage, history, sendMessage } = this.props;
        
        if (successMessage === 'User deleted') {
            sendMessage(successMessage);
            history.push('/users');
        }
    }
    
    handleDelete() {
        if (confirm('Are you sure you want to delete this user?  This is not reversible.')) {
            this.props.deleteUser(this.props.match.params.id);
        }
    }
    
    renderUser() {
        const { user } = this.props;
        
        if (!user) return;
        
        return (
            <section className="section user-show">
                <div className="container">
                    <div className="card">
                        <header className="card-header">
                            <h1 className="card-header-title">
                                { user.name }
                            </h1>
                        </header>
                        <div className="card-content">
                            <div class="content">
                                <p>
                                    <h6 classsName="title is-6">Username</h6>
                                    <address>{ user.username }</address>
                                </p>
                                <p>
                                    <h6 classsName="title is-6">Email</h6>
                                    <address>{ user.email }</address>
                                </p>
                            </div>
                            <p className="buttons">
                                <Link to={ `/users/${ this.props.match.params.id }/edit` } className="button is-link">
                                    <span>Edit User</span>
                                    <span className="icon is-small">
                                        <i className="far fa-edit"></i>
                                    </span>
                                </Link>
                                <a onClick={ this.handleDelete } className="button is-danger">
                                    <span>Delete User</span>
                                    <span className="icon is-small">
                                        <i className="fas fa-times"></i>
                                    </span>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
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

const mapStateToProps = state => ({ user: state.users.user, successMessage: state.users.successMessage });

export default connect(mapStateToProps, { fetchUser, deleteUser, sendMessage, clearUserMessages })(UserShow);