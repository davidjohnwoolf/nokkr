import React from 'react';
import { connect } from 'react-redux';

import { fetchLead } from '../../actions/leads.action';
import { fetchLeadStatuses } from '../../actions/lead-statuses.action';

import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';

//import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

class LeadShow extends React.Component {

    state = { isLoading: true }
    
    componentDidMount() {
        const { fetchLead, fetchLeadStatuses, match } = this.props;
        
        fetchLead(match.params.id);
        fetchLeadStatuses();
    }
    
    componentDidUpdate() {
        if (this.props.lead && this.props.leadStatuses && this.state.isLoading) this.setState({ isLoading: false });
    }
    
    render() {
        const {
            props: {
                lead,
                //role,
                //isReadOnly,
                leadStatuses,
                history,
                match: { params }
            },
            state: { isLoading }
        } = this;
        
        const contentAccess = true //((role === ADMIN || (role === SU) || ()) && !isReadOnly);
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="user-show" className="content">
                <ContentHeader title={ lead.firstName + ' ' + lead.lastName } history={ history } chilrenAccess={ contentAccess }>
                    <IconLink url={ `/leads/${ params.id }/edit` } icon="edit" />
                </ContentHeader>
                <section className="card">
                    <section>
                        <h4>Status</h4>
                        <p>{ leadStatuses.find(status => status._id === lead.leadStatusId).title } { lead.city }, { lead.state } { lead.zipcode }</p>
                        <h4>Address</h4>
                        <address>{ lead.address } { lead.city }, { lead.state } { lead.zipcode }</address>
                        <h4>Phone</h4>
                        <address>{ lead.primaryPhone || 'NA' }</address>
                    </section>
                </section>
                <h2>Appointments and Notes</h2>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    lead: state.leads.lead,
    leadStatuses: state.leadStatuses.leadStatuses,
    //role: state.auth.role,
    //isReadOnly: state.auth.isReadOnly
});

export default connect(mapStateToProps, { fetchLead, fetchLeadStatuses })(LeadShow);