import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';


class Navigation extends React.Component {
    
    render() {
        return (
			<nav className="navigation">
				<ul>
				    <li>
				        <Link to="/" className="active">Home</Link>
				    </li>
				    <li>
				        <Link to="/user">
				            <span className="fa fa-map"></span>
				        </Link>
				    </li>
				    <li>
				        <Link to="/">
				            <span className="fa fa-users"></span>
				        </Link>
				    </li>
			        <li>
				        <Link to="/">
				            <span className="fa fa-calendar"></span>
				        </Link>
				    </li>
				    <li>
				        <Link to="/">
				            <span className="fa fa-search"></span>
				        </Link>
				    </li>
				    <li>
				        <Link to="/">
				            <span className="fa fa-bars"></span>
				        </Link>
				    </li>
				</ul>
			</nav>
        );
    }
}

export default Navigation;