import React from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { logout } from '../../actions/auth.action';

import Menu from './menu';

class Header extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            menuActive: false
        }
        
        this.showMenu = this.showMenu.bind(this);
    }
    
    showMenu() {
        let menuActive = (this.state.menuActive ? false : true);
        this.setState({ menuActive })
    }

    render() {
        const { authenticated, sessionId, role, sessionTeam, logout } = this.props;
        
        if (authenticated) {
            return (
                <header id="header">
                    <nav className="header-nav">
                        <ul>
                            <li>
                                <NavLink exact to="/" activeClassName="active"><i className="fas fa-home"></i></NavLink>
                            </li>
                            <li>
                                <NavLink to={ `/users/${ sessionId }/areas` } activeClassName="active"><i className="fas fa-map-marker-alt"></i></NavLink>
                            </li>
                            <li>
                                <NavLink to={ `/users/${ sessionId }/leads` } activeClassName="active"><i className="fas fa-address-card"></i></NavLink>
                            </li>
                            <li>
                                <NavLink to={ `/users/${ sessionId }/appointments` } activeClassName="active"><i className="fas fa-calendar-alt"></i></NavLink>
                            </li>
                            <li>
                                <NavLink to="/new" activeClassName="active"><i className="fas fa-plus"></i></NavLink>
                            </li>
                            <li>
                                <a
                                    onClick={ this.showMenu }
                                    style={{ cursor: 'pointer' }}
                                    className={ this.state.menuActive ? 'active' : '' }>
                                    
                                    <i className="fas fa-bars"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <Menu shown={ this.state.menuActive } id={ sessionId } role={ role } team={ sessionTeam } logout={ logout } showMenu={ this.showMenu } />
                </header>
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => ({
    authenticated: state.auth.authenticated,
    sessionId: state.auth.sessionId,
    role: state.auth.role,
    sessionTeam: state.auth.sessionTeam
});

export default withRouter(connect(mapStateToProps, { logout })(Header));