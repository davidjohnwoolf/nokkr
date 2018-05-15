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
                    <div className="panel-block" key={ user.id }>
                        <Link to={ `/users/${ user.id }` }>
    			            { user.name }
    			        </Link>
			        </div>
                );
            })
        );
    }
    
    render() {
        
        return (
            <section className="section user-index">
                <div className="container">
                    <h1 className="title">Users</h1>
                    <nav className="panel">
                        { this.renderUsers() }
                    </nav>
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => ({ users: state.users.users });


export default connect(mapStateToProps, { fetchUsers })(UserIndex);