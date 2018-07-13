import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchUsers } from '../../actions/users.action';

import Loading from '../layout/loading';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';
import { capitalize } from '../../../lib/functions';

class UserIndex extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: true,
            activeUsersShown: true
        };
        
        this.toggleActiveUsers = this.toggleActiveUsers.bind(this);
        this.renderUsers = this.renderUsers.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchUsers()
    }
    
    componentDidUpdate() {
        if (this.props.users && this.state.isLoading) this.setState({ isLoading: false });
    }
    
    toggleActiveUsers() {
        this.setState({ activeUsersShown: !this.state.activeUsersShown});
    }
	
    renderUsers() {
        const { users, isReadOnly } = this.props;
        const { activeUsersShown } = this.state;
        
        return (
            users.map(user => {
                
                if (user.role === SU) return false;
                if (activeUsersShown && !user.isActive) return false;
                if (!activeUsersShown && user.isActive) return false;
                
                return (
                    <tr key={ user._id }>
                        <td>
                            <div className="cell-container">
                                <Link to={ `/users/${ user._id }` }>{ `${ user.firstName } ${ user.lastName }` }</Link>
                                { !isReadOnly ? <Link to={ `/users/${ user._id }/edit` }><i className="fa fa-edit"></i></Link> : '' }
                            </div>
                        </td>
                        <td>{ user.teamTitle }</td>
                        <td>{ capitalize(user.role) + (user.isReadOnly ? ' Read Only' : '') }</td>
                    </tr>
                );
            })
        );
    }
    
    render() {
        if (this.state.isLoading) return <Loading />;
        
        const { toggleActiveUsers, renderUsers, props } = this;
        const { isReadOnly, history } = props;
        
        return (
            <main id="user-index" className="content">
                <header className="content-header">
                    <a onClick={ history.goBack } className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
                    <h1>User Management</h1>
                    { !isReadOnly ? <Link className="icon-button-success" to="/users/new"><i className="fas fa-plus"></i></Link> : '' }
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
                        { renderUsers() }
                    </tbody>
                </table>
                <button className="btn btn-primary" onClick={ toggleActiveUsers }>
                    { this.state.activeUsersShown ? 'Show Inactive Users' : 'Show Active Users' }
                </button>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    users: state.users.users,
    isReadOnly: state.auth.isReadOnly
});


export default connect(mapStateToProps, { fetchUsers })(UserIndex);