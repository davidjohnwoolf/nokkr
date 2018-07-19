import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';
import { capitalize } from '../../../lib/functions';
import { sortItems } from '../helpers/list';

import { fetchUsers } from '../../actions/users.action';

import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';

class UserIndex extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: true,
            activeShown: true,
            userList: [],
            userCount: 0,
            sortSettings: {
                column: undefined,
                ascending: true
            }
        };
        
        this.toggleActive = this.toggleActive.bind(this);
        this.sortList = this.sortList.bind(this);
        this.renderUsers = this.renderUsers.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchUsers();
    }
    
    componentDidUpdate(prevProps, prevState) {
        const {
            props: { users },
            state: {
                isLoading,
                activeShown,
                userList, 
                sortSettings
            }
        } = this;
        
        //initialize
        if (users && isLoading) {
            
            //initialize with sort by name
            const initialList = users.filter(user => (user.role !== SU) && user.isActive);
            
            this.setState({ isLoading: false, userCount: initialList.length, userList: initialList });
        }
        
        //update user list on active user toggle
        if (!isLoading && prevState.activeShown !== activeShown) {
            
            const filteredList = users.filter(user => {
                if (user.role !== SU) return activeShown ? user.isActive : !user.isActive;
            });
            
            this.setState({ userList: sortItems(filteredList, sortSettings), userCount: filteredList.length });
        }
        
        //update user list on sort
        if (!isLoading && prevState.sortSettings !== sortSettings) {
            this.setState({ userList: sortItems(userList, sortSettings) });
        }
    }
    
    toggleActive() {
        this.setState({ activeShown: !this.state.activeShown});
    }
    
    sortList(col) {
        const { sortSettings: { column, ascending } } = this.state;
        
        col === column
            ? this.setState({ sortSettings: { column, ascending: !ascending } })
            : this.setState({ sortSettings: { column: col, ascending: true } });
    }
	
    renderUsers() {
        const { userList } = this.state;
        
        return (
            userList.map(user => {

                return (
                    <tr key={ user._id }>
                        <td>
                            <Link to={ `/users/${ user._id }` }>{ `${ user.firstName } ${ user.lastName }` }</Link>
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
            state: { isLoading, activeShown, userCount, sortSettings },
            toggleActive,
            renderUsers,
            sortList
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
                            
                            <th>
                                <div onClick={ () => sortList('firstName') } className="sort-control">
                                    Name <i className={
                                        sortSettings.column === 'firstName'
                                            ? (sortSettings.ascending ? 'fas fa-caret-down' : 'fas fa-caret-up')
                                            : 'fas fa-sort'
                                    }></i>
                                </div>
                            </th>
                            <th>
                                <div onClick={ () => sortList('teamTitle') } className="sort-control">
                                    Team <i className={
                                        sortSettings.column === 'teamTitle'
                                            ? (sortSettings.ascending ? 'fas fa-caret-down' : 'fas fa-caret-up')
                                            : 'fas fa-sort'
                                    }></i>
                                </div>
                            </th>
                            <th>
                                <div onClick={ () => sortList('role') } className="sort-control">
                                    Role <i className={
                                        sortSettings.column === 'role'
                                            ? (sortSettings.ascending ? 'fas fa-caret-down' : 'fas fa-caret-up')
                                            : 'fas fa-sort'
                                    }></i>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderUsers() }
                    </tbody>
                </table>
                <div className="button-group">
                    <div className="toggle">
                        <label>Toggle Inactive</label>
                        <span onClick={ toggleActive }>
                            <i className={ !activeShown ? 'fas fa-toggle-on' : 'fas fa-toggle-off' }></i>
                        </span>
                    </div>
                    <p style={{ marginTop: '1rem' }}>Users Shown: { userCount }</p>
                </div>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    users: state.users.users,
    isReadOnly: state.auth.isReadOnly
});


export default connect(mapStateToProps, { fetchUsers })(UserIndex);