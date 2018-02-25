import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchUsers } from '../../actions/users.action';

class UserIndex extends React.Component {
    
    constructor(props) {
        super(props);
        this.props.fetchUsers();
    }
	
    renderUsers() {
        const { users } = this.props;
        
        if (!users) return;
        
        return (
            users.map((user) => {
                return (
                    <li key={ user._id }>
                        <Link to={ `/user/${user._id}` }>
				            { user.name }
				        </Link>
                    </li>
                );
            })
        );
    }
    
    render() {
        
        return (
            <div className="component-page user-index">
                <ul className="column-list">
                    { this.renderUsers() }
                </ul>
            </div>
        );
    }
}

const mapStateToProps = state => {
	return { users: state.usersReducer.users };
};


export default connect(mapStateToProps, { fetchUsers })(UserIndex);