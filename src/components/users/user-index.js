import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchUsers } from '../../actions/users.action';

class UserIndex extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.fetchUsers();
    }
	
    renderUsers() {
        const { users } = this.props;
        
        if (!users) return;
        
        return (
            users.map(user => {
                
                let userRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);
                
                if (user.isReadOnly) userRole += ' Read Only';
                
                return (
                    <tr key={ user._id }>
                        <td><Link to={ `/users/${ user._id }` }>{ `${ user.firstName } ${ user.lastName }` }</Link></td>
                        <td>{ user.team || 'NA' }</td>
                        <td>{ userRole }</td>
                    </tr>
                );
            })
        );
    }
    
    render() {
        
        return (
            <main id="user-index" className="content">
                <section className="index">
                    <header className="content-header">
                        <h1>Users</h1>
                        <Link className="icon-button-success" to="/users/new"><i className="fas fa-plus"></i></Link>
                    </header>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Team</th>
                                <th>Permissions</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            { this.renderUsers() }
                        </tbody>
                    </table>
                </section>
            </main>
        );
    }
}

const mapStateToProps = state => ({ users: state.users.users });


export default connect(mapStateToProps, { fetchUsers })(UserIndex);