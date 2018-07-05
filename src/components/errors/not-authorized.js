import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class NotAuthorized extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        const { authenticated } = this.props;
        
        return (
            <main id="not-authorized" className="content">
                <section className="error-page">
                    <h1>403 Not Authorized</h1>
                    { !authenticated ? <Link className="btn btn-primary" to="/login">Login</Link> : <h4>You do not have permission to see this</h4> }
                </section>
            </main>
        )
    };
}

const mapStateToProps = state => ({
    authenticated: state.auth.authenticated
});


export default connect(mapStateToProps)(NotAuthorized);