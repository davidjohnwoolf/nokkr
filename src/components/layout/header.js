import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Header extends React.Component {
    
    //set menu actions with local component state
    
    constructor(props) {
        super(props);
        
        this.state = {
            menuShown: false
        }
        
        this.handleDropdown = this.handleDropdown.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }
    
    handleDropdown(e) {
        e.preventDefault();
        
        !this.state.menuShown
            ? this.setState({ menuShown: true })
            : this.setState({ menuShown: false })
    }
    
    handleLogout(e) {
        e.preventDefault();
        
        console.log('logout');
    }
    
    render() {
        const { handleDropdown, handleLogout, state } = this;
        
        if (this.props.authenticated) {
            return (
                <header id="header">
                    <nav className="header-nav">
                        <ul>
                            <li>
                                <Link to="/"><i className="fas fa-home" aria-hidden="true"></i></Link>
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
                                <a onClick={ handleDropdown } className={ state.menuShown ? 'clicked' : '' } href="#"><i className="fas fa-bars"></i></a>
                                <ul className={ `submenu ${ !state.menuShown ? 'invisible' : '' }` }>
                                    <li>
                                        <Link to="/users">Users</Link>
                                    </li>
                                    <li>
                                        <Link to={ `/users/${ this.props.id }` }>Account</Link>
                                    </li>
                                    <li>
                                        <a onClick={ handleLogout } href="#">Logout</a>
                                    </li>
                                </ul>
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