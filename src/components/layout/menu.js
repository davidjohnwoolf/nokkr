import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { USER, MANAGER, ADMIN, SU } from '../../../lib/constants';

class Menu extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.handleLogout = this.handleLogout.bind(this);
    }
    
    handleLogout(e) {
        e.preventDefault();
        
        const { logout, history } = this.props;
        
        sessionStorage.removeItem('token');
        logout();
        history.push('/login');
    }
    
    render() {
            const { shown, id, role, team, showMenu } = this.props;
        
            return (
                <nav id="main-menu" className={ shown ? '' : 'invisible' }>
                    <div>
                        <h5>User Options</h5>
                        <ul>
                            <li>
                                <Link onClick={ showMenu } to={ `/users/${ id }` }>Account <i className="fas fa-user-circle" aria-hidden="true"></i></Link>
                            </li>
                            <li>
                                <Link onClick={ showMenu } to="/reports">Reports <i className="fas fa-chart-bar"></i></Link>
                            </li>
                            <li>
                                <Link onClick={ showMenu } to="/address-lookup">Address Lookup <i className="fas fa-address-card"></i></Link>
                            </li>
                            <li>
                                <Link onClick={ showMenu } to="/support">Dealer Resources <i className="fas fa-info-circle"></i></Link>
                            </li>
                            <li>
                                <Link onClick={ showMenu } to="/support">Support <i className="fas fa-comments"></i></Link>
                            </li>
                            <li>
                                <a onClick={ () => {
                                        showMenu();
                                        this.handleLogout();
                                    }
                                } href="/logout">Logout <i className="fas fa-sign-out-alt"></i></a>
                            </li>
                        </ul>
                    </div>
                    { role === MANAGER
                        ? (
                            <div>
                                <h5>Manager Options</h5>
                                <ul>
                                    <li>
                                        <Link onClick={ showMenu } to={ `/teams/${ team }` }>Team Management <i className="fas fa-users"></i></Link>
                                    </li>
                                    <li>
                                        <Link onClick={ showMenu } to="/areas">Area Management <i className="fas fa-map"></i></Link>
                                    </li>
                                    { /* automatically goes to team leads */ }
                                    <li>
                                        <Link onClick={ showMenu } to="/leads">Lead Management <i className="fas fa-address-card"></i></Link>
                                    </li>
                                </ul>
                            </div>
                        ) : '' }
                    { role === ADMIN || role === SU
                        ? (
                            <div>
                                <h5>Admin Options</h5>
                                <ul>
                                    <li>
                                        <Link onClick={ showMenu } to="/new">Dealer Account <i className="fas fa-cog"></i></Link>
                                    </li>
                                    <li>
                                        <Link onClick={ showMenu } to="/teams">Team Management <i className="fas fa-users"></i></Link>
                                    </li>
                                    <li>
                                        <Link onClick={ showMenu } to="/users">User Management <i className="fas fa-user"></i></Link>
                                    </li>
                                    <li>
                                        <Link onClick={ showMenu } to="/areas">Area Management <i className="fas fa-map"></i></Link>
                                    </li>
                                    { /* automatically goes to company leads */ }
                                    <li>
                                        <Link onClick={ showMenu } to="/leads">Lead Management <i className="fas fa-address-card"></i></Link>
                                    </li>
                                </ul>
                            </div>
                        ) : '' }
                </nav>
            );
    }
}

export default withRouter(Menu);