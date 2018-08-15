import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchAccount } from '../../actions/account.action';

import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';

class AccountShow extends React.Component {

    state = { isLoading: true }
    
    componentDidMount() {
        this.props.fetchAccount();
    }
    
    componentDidUpdate() {
        if (this.props.account && this.state.isLoading) this.setState({ isLoading: false });
    }
    
    render() {
        const {
            props: {
                account,
                role,
                isReadOnly,
                history,
                match: { params }
            },
            state: { isLoading }
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="user-show" className="content">
                <ContentHeader title="Account Settings" history={ history } />
                <section className="card">
                    <section>
                        <h4>Dealer Name</h4>
                        <p>{ account.dealerName }</p>
                        <h4>Address</h4>
                        <address>{ `${ account.address } ${ account.city }, ${ account.state } ${ account.zipcode }` }</address>
                        <h4>Phone Number</h4>
                        <p>{ account.phone }</p>
                    </section>
                </section>
                <div className="button-group">
                    <Link to="/lead-statuses" className="button primary">Lead Statuses</Link>
                    <Link to="/lead-fields" className="button primary">Lead Fields</Link>
                </div>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account
});

export default connect(mapStateToProps, { fetchAccount })(AccountShow);