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
                    <h1 className="title">{ user.name }</h1>
                    <h4 className="subtitle">{ user.username }</h4>
                    <address>{ user.email }</address>
                    <Link to={ `/users/${ this.props.match.params.id }/edit` } className="button is-link">Edit</Link>
                    <button onClick={ this.handleDelete } className="button is-danger">
                        Delete User
                    </button>
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