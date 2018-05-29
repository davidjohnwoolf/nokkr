import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

class Header extends React.Component {
    
    render() {
        if (this.props.authenticated) {
            return (
                <header id="header">
                    <nav className="header-nav">
                        <ul>
                            <li>
                                <Link to="/"><i className="fas fa-home"></i></Link>
                            </li>
                            <li>
                                <Link to="/user/id/areas"><i className="fas fa-map-marker-alt"></i></Link>
                            </li>
                            <li>
                                <Link to="/user/id/leads"><i className="fas fa-users"></i></Link>
                            </li>
                            <li>
                                <Link to="/user/id/appointments"><i className="fas fa-calendar"></i></Link>
                            </li>
                            <li>
                                <Link to="/new"><i className="fas fa-plus"></i></Link>
                            </li>
                            <li>
                                <Link to="/menu"><i className="fas fa-bars"></i></Link>
                            </li>
                        </ul>
                    </nav>
                </header>
            );
        } else {
            return null;
        }
    }
};

const mapStateToProps = state => ({
    authenticated: state.authentication.authenticated
});

export default connect(mapStateToProps)(withRouter(Header));