import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchUsers } from '../../actions/users.action';

import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';

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
        this.props.fetchUsers();
    }
    
    componentDidUpdate() {
        const { props: { users }, state: { isLoading } } = this;
        
        if (users && isLoading) this.setState({ isLoading: false });
    }
    
    toggleActiveUsers() {
        this.setState({ activeUsersShown: !this.state.activeUsersShown});
    }
	
    renderUsers() {
        const { props: { users, isReadOnly }, state: { activeUsersShown } } = this;
        
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
                                {
                                    !isReadOnly
                                        ? <Link to={ `/users/${ user._id }/edit` }><i className="fas fa-edit"></i></Link>
                                        : ''
                                }
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
        const {
            props: { isReadOnly, history },
            state: { isLoading, activeUsersShown },
            toggleActiveUsers,
            renderUsers
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="user-index" className="content">
                <ContentHeader title="User Management" history={ history } chilrenAccess={ !isReadOnly }>
                    <IconLink url="/users/new" type="success" icon="plus" />
                </ContentHeader>
                
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
                <button className="button primary" onClick={ toggleActiveUsers }>
                    { activeUsersShown ? 'Show Inactive Users' : 'Show Active Users' }
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