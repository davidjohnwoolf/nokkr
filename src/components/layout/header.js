import React from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';

class Header extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.renderMenuLink = this.renderMenuLink.bind(this);
    }
    
    renderMenuLink(path) {
        return this.props.location.pathname === path
            ? <a onClick={ this.props.history.goBack } href="#" className="active"><i className="fas fa-bars"></i></a>
            : <NavLink to="/menu" activeClassName="active"><i className="fas fa-bars"></i></NavLink>;
    }

    render() {
        
        const { authenticated } = this.props;
        
        if (authenticated) {
            return (
                <header id="header">
                    <nav className="header-nav">
                        <ul>
                            <li>
                                <NavLink exact to="/" activeClassName="active"><i className="fas fa-home"></i></NavLink>
                            </li>
                            <li>
                                <NavLink to="/user/id/areas" activeClassName="active"><i className="fas fa-map-marker-alt"></i></NavLink>
                            </li>
                            <li>
                                <NavLink to="/user/id/leads" activeClassName="active"><i className="fas fa-users"></i></NavLink>
                            </li>
                            <li>
                                <NavLink to="/user/id/appointments" activeClassName="active"><i className="fas fa-calendar-alt"></i></NavLink>
                            </li>
                            <li>
                                <NavLink to="/new" activeClassName="active"><i className="fas fa-plus"></i></NavLink>
                            </li>
                            <li>
                                { this.renderMenuLink('/menu') }
                            </li>
                        </ul>
                    </nav>
                </header>
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => ({ authenticated: state.auth.authenticated });

export default withRouter(connect(mapStateToProps)(Header));