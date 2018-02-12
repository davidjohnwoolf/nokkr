import React from 'react';
import { connect } from 'react-redux';

import { fetchUsers } from '../../actions/users.action';

class UserIndex extends React.Component {
    
    componentDidMount() {
		if (!this.props.users) this.props.fetchUsers();
	}
	
    renderUsers() {
        return (
            this.props.users.map((user) => {
                return (
                    <li key={ user._id }>
                        <h4>{ user.name }</h4>
                        <span>
                            <a href="">Edit</a>
                            <a href="">Delete</a>
                        </span>
                    </li>
                );
            })
        );
    }
    
    render() {
        
        const { users } = this.props;
        
        return (
            <div className="component-page user-index">
                <ul class="column-list">
                    { users ? this.renderUsers() : '' }
                </ul>
            </div>
        );
    }
}

const mapStateToProps = state => {
	return { users: state.users };
};


export default connect(mapStateToProps, { fetchUsers })(UserIndex);