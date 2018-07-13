import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchUser } from '../../actions/users.action';

import Loading from '../layout/loading';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';
import { capitalize } from '../../../lib/functions';

class UserShow extends React.Component {

    state = { isLoading: true }
    
    componentDidMount() {
        const { fetchUser, match } = this.props;
        
        fetchUser(match.params.id);
    }
    
    componentDidUpdate() {
        if (this.props.user && this.state.isLoading) this.setState({ isLoading: false });
    }
    
    render() {
        if (this.state.isLoading) return <Loading />;
        
        const { user, role, isReadOnly, history, match } = this.props;
        
        return (
            <main id="user-show" className="content">
                <header className="content-header">
                    <a onClick={ history.goBack } className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
                    <h1>{ `${ user.firstName } ${ user.lastName }` }</h1>
                    { ((role === ADMIN || (role === SU)) && !isReadOnly)
                        ? <Link to={ `/users/${ match.params.id }/edit` } className="icon-button-primary"><i className="fas fa-edit"></i></Link>
                        : '' }
                </header>
                <section className="card">
                    <section>
                        <h4>Username</h4>
                        <address>{ user.username }</address>
                        <h4>Email</h4>
                        <address>{ user.email }</address>
                        <h4>Team</h4>
                        <p>{ user.teamTitle }</p>
                        <h4>Role</h4>
                        <p>{ capitalize(user.role) + (isReadOnly ? ' Read Only' : '') }</p>
                    </section>
                </section>
                <section className="index">
                    <h2>Upcoming Apts, Recent Leads etc.</h2>
                </section>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    user: state.users.user,
    role: state.auth.role,
    isReadOnly: state.auth.isReadOnly
});

export default connect(mapStateToProps, { fetchUser })(UserShow);