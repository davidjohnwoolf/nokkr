import React from 'react';
import { connect } from 'react-redux';

import { fetchUser } from '../../actions/users.action';

import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';

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
        const {
            props: {
                user,
                role,
                isReadOnly,
                history,
                match: { params }
            },
            state: { isLoading }
        } = this;
        
        const contentAccess = ((role === ADMIN || (role === SU)) && !isReadOnly);
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="user-show" className="content">
                <ContentHeader title={ user.firstName + ' ' + user.lastName } history={ history } chilrenAccess={ contentAccess }>
                    <IconLink url={ `/users/${ params.id }/edit` } icon="edit" />
                </ContentHeader>
                <section className="card">
                    <section>
                        <h4>Username</h4>
                        <address>{ user.username }</address>
                        <h4>Email</h4>
                        <address>{ user.email }</address>
                        <h4>Team</h4>
                        <p>{ user.teamTitle || '---' }</p>
                        <h4>Role</h4>
                        <p>{ capitalize(user.role) + (isReadOnly ? ' Read Only' : '') }</p>
                    </section>
                </section>
                <h2>Upcoming Apts, Recent Leads etc.</h2>
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