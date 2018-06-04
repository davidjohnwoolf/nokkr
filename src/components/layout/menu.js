import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { logout } from '../../actions/auth.action';

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
            return (
                <nav id="main-menu">
                    <h5>User Options</h5>
                    <ul>
                        <li>
                            <Link to={ `/users/${ this.props.id }` }>Account <i className="fas fa-user" ></i></Link>
                        </li>
                        <li>
                            <Link to="/reports">Reports <i className="fas fa-chart-bar"></i></Link>
                        </li>
                        <li>
                            <Link to="/address-lookup">Address Lookup <i className="fas fa-address-card"></i></Link>
                        </li>
                        <li>
                            <Link to="/support">Dealer Resources <i className="fas fa-info-circle"></i></Link>
                        </li>
                        <li>
                            <Link to="/support">Support <i className="fas fa-comments"></i></Link>
                        </li>
                        <li>
                            <a onClick={ this.handleLogout } href="/logout">Logout <i className="fas fa-sign-out-alt"></i></a>
                        </li>
                    </ul>
                    
                    <h5>Admin Options</h5>
                    <ul>
                        <li>
                            <Link to="/new">Company Settings <i className="fas fa-cog"></i></Link>
                        </li>
                        <li>
                            <Link to="/users">User Management <i className="fas fa-users"></i></Link>
                        </li>
                        <li>
                            <Link to="/areas/new">Area Management <i className="fas fa-map"></i></Link>
                        </li>
                        <li>
                            <Link to="/leads">Lead Management <i className="fas fa-address-book"></i></Link>
                        </li>
                    </ul>
                </nav>
            );
    }
};

const mapStateToProps = state => ({
    id: state.auth.id
});

export default connect(mapStateToProps, { logout })(withRouter(Menu));