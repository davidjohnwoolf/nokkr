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
    
    showMenu(e) {
        e.preventDefault();
        
        let menuActive = (this.state.menuActive ? false : true);
        this.setState({ menuActive })
    }

    render() {
        const { authenticated, id, role, team, logout } = this.props;
        
        console.log('props', this.props);
        
        if (authenticated) {
            return (
                <header id="header">
                    <nav className="header-nav">
                        <ul>
                            <li>
                                <NavLink exact to="/" activeClassName="active"><i className="fas fa-home"></i></NavLink>
                            </li>
                            <li>
                                <NavLink to={ `/users/${ id }/areas` } activeClassName="active"><i className="fas fa-map-marker-alt"></i></NavLink>
                            </li>
                            <li>
                                <NavLink to={ `/users/${ id }/leads` } activeClassName="active"><i className="fas fa-users"></i></NavLink>
                            </li>
                            <li>
                                <NavLink to={ `/users/${ id }/appointments` } activeClassName="active"><i className="fas fa-calendar-alt"></i></NavLink>
                            </li>
                            <li>
                                <NavLink to="/new" activeClassName="active"><i className="fas fa-plus"></i></NavLink>
                            </li>
                            <li>
                                <a
                                    onClick={ (e) => this.showMenu(e) }
                                    className={ this.state.menuActive ? 'active' : '' }
                                    href="#">
                                    
                                    <i className="fas fa-bars"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <Menu shown={ this.state.menuActive } id={ id } role={ role } team={ team } logout={ logout } showMenu={ this.showMenu } />
                </header>
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => ({
    authenticated: state.auth.authenticated,
    id: state.auth.id,
    role: state.auth.role,
    team: state.auth.team
});

export default withRouter(connect(mapStateToProps, { logout })(Header));