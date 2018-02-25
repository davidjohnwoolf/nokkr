import React from 'react';
import { connect } from 'react-redux';

import { fetchUser } from '../../actions/users.action';

class UserShow extends React.Component {
    
	constructor(props) {
        super(props);
        this.props.fetchUser(this.props.match.params.id);
    }
    
    renderUser() {
        const { user } = this.props;
        
        if (!user) return;
        
        return (
            <div>
                <h1>{ user.name } <span className="edit-icon fa fa-pencil-square-o"></span></h1>
                <h4>{ user.username } <span className="edit-icon fa fa-pencil-square-o"></span></h4>
                <address>{ user.email } <span className="edit-icon fa fa-pencil-square-o"></span></address>
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


export default connect(mapStateToProps, { fetchUser })(UserShow);