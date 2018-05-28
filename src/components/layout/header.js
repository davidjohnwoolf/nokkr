import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Header extends React.Component {
    
    //set menu actions with local component state
    
    render() {
        if (this.props.authenticated) {
            return (
                <header id="header">
                    <nav className="header-nav">
                        <ul>
                            <li className="logo">
                                <Link to="/">Platform 2K</Link>
                            </li>
                            <li>
                                <Link to="/areas"><i className="fas fa-map" aria-hidden="true"></i></Link>
                            </li>
                            <li>
                                <Link to="/leads"><i className="fas fa-users" aria-hidden="true"></i></Link>
                            </li>
                            <li>
                                <Link to="/appointments"><i className="fas fa-calendar" aria-hidden="true"></i></Link>
                            </li>
                            <li>
                                <Link to="/new"><i className="fas fa-plus" aria-hidden="true"></i></Link>
                            </li>
                            <li className="dropdown">
                                <a>
                                    <i className="fas fa-bars"></i>
                                    <ul>
                                        <li>
                                            <Link to="/users">Users</Link>
                                        </li>
                                        <li>
                                            <Link to={ `/users/${ this.props.id }` }>Account</Link>
                                        </li>
                                        <li>
                                            <Link to="/logout">Logout</Link>
                                        </li>
                                    </ul>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </header>
            );
        } else {
            return (
                <header id="header">
                    <nav className="header-nav">
                        <ul>
                            <li>
                                <Link to="/users/new">Create User</Link>
                            </li>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                        </ul>
                    </nav>
                </header>
            );
        }
        
    }
};

const mapStateToProps = state => ({
    authenticated: state.authentication.authenticated,
    id: state.authentication.id
});

export default connect(mapStateToProps)(Header);