import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchUsers } from '../../actions/users';

class UserIndex extends React.Component {
    
    constructor(props) {
        super(props);
        props.fetchUsers();
    }
	
    renderUsers() {
        const { users } = this.props;
        
        if (!users) return;
        
        return (
            users.map((user) => {
                return (
                    <li>
                        <Link to={ `/users/${ user.id }` } className="panel-block" key={ user.id }>
    			            { user.name }
    			        </Link>
			        </li>
                );
            })
        );
    }
    
    render() {
        
        return (
            <main id="user-index" className="content">
                <section className="index">
                    <h1>Users</h1>
                    <ul className="link-list">
                        { this.renderUsers() }
                    </ul>
                </section>
            </main>
        );
    }
}

const mapStateToProps = state => ({ users: state.users.users });


export default connect(mapStateToProps, { fetchUsers })(UserIndex);