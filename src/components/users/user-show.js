import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchUser, deleteUser } from '../../actions/users.action';

class UserShow extends React.Component {
    
	componentDidMount() {
        this.props.fetchUser(this.props.match.params.id);
    }
    
    handleDelete() {
        if (confirm('Are you sure you want to delete this user?')) {
            this.props.deleteUser(this.props.match.params.id);
            this.props.history.push(`/user/?message=Deleted+User+Successfully`);
        }
    }
    
    renderUser() {
        const { user } = this.props;
        
        if (!user) return;
        
        return (
            <div className="component-page user-show">
                <h1>{ user.name }</h1>
                <h4>{ user.username }</h4>
                <address>{ user.email }</address>
                <Link to={ `/user/${user.id}/edit` } className="edit-button">
		            Edit User
		        </Link>
                <button onClick={ this.handleDelete.bind(this) } className="delete-button">
		            Delete User
		        </button>
            </div>
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

const mapStateToProps = state => {
	return { user: state.usersReducer.user };
};


export default connect(mapStateToProps, { fetchUser, deleteUser })(UserShow);