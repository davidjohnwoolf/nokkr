import React from 'react';
import { connect } from 'react-redux';

import { fetchUser } from '../../actions/users';

class UserShow extends React.Component {
    
	constructor(props) {
        super(props);
        this.props.fetchUser(this.props.match.params.id);
    }
    
    //handleDelete() {
    //     if (confirm('Are you sure you want to delete this user?')) {
    //         this.props.deleteUser(this.props.match.params.id);
    //         this.props.history.push(`/user/?message=Deleted+User+Successfully`);
    //     }
    // }
    // in renderUser
    // <button onClick={ this.handleDelete.bind(this) } className="delete-button">
    //     Delete User
    // </button>
    
    renderUser() {
        const { user } = this.props;
        
        if (!user) return;
        
        return (
            <section className="section user-show">
                <div className="container">
                    <h1 className="title">{ user.name }</h1>
                    <h4 className="subtitle">{ user.username }</h4>
                    <address>{ user.email }</address>
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

const mapStateToProps = state => ({ user: state.usersReducer.user });

export default connect(mapStateToProps, { fetchUser })(UserShow);