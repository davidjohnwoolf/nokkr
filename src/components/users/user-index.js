import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchUsers } from '../../actions/users.action';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

class UserIndex extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.fetchUsers();
    }
	
    renderUsers() {
        const { users, role, id, team } = this.props;
        
        if (!users) return;
        
        return (
            users.map(user => {
                
                let userRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);
                
                if (user.isReadOnly) userRole += ' Read Only';
                
                if (user.role === SU && (role !== SU)) {
                    return false;
                }
                
                return (
                    <tr key={ user._id }>
                        <td>
                            <div className="cell-container">
                                <Link to={ `/users/${ user._id }` }>{ `${ user.firstName } ${ user.lastName }` }</Link>
                                { this.props.isReadOnly ? <Link to={ `/users/${ user._id }/edit` }><i className="fa fa-edit"></i></Link> : '' }
                            </div>
                        </td>
                        <td>{ user.team || '' }</td>
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
                        <a onClick={ this.props.history.goBack } href="#" className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
                        <h1>User Management</h1>
                        { this.props.isReadOnly ? <Link className="icon-button-success" to="/users/new"><i className="fas fa-plus"></i></Link> : '' }
                    </header>
                    
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Team</th>
                                <th>Role</th>
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

const mapStateToProps = state => ({
    users: state.users.users,
    id: state.auth.id,
    role: state.auth.role,
    isReadOnly: state.auth.isReadOnly,
    team: state.auth.team
});


export default connect(mapStateToProps, { fetchUsers })(UserIndex);