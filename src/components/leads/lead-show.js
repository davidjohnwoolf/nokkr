import React from 'react';
import { connect } from 'react-redux';

import { fetchLeads, clearLeads } from '../../actions/leads.action';
import { fetchLeadStatuses } from '../../actions/lead-statuses.action';
import { fetchLeadFields } from '../../actions/lead-fields.action';
import { fetchUsers } from '../../actions/users.action';

import { formatLabel } from '../../../lib/functions';

import LeadEdit from '../leads/lead-edit';

import Modal from '../layout/modal';
import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';

//import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

class LeadShow extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearLeads();
        
        this.state = {
            editModalShown: false,
            isLoading: true,
            lead: null
        };

        this.renderCustomLeadFields = this.renderCustomLeadFields.bind(this);
        this.toggleProp = this.toggleProp.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchLeads();
        this.props.fetchLeadStatuses();
        this.props.fetchLeadFields();
        this.props.fetchUsers();
    }
    
    componentDidUpdate() {
        if (this.props.leads && this.state.isLoading) {
            this.setState({ isLoading: false, lead: this.props.leads.find(item => item._id == this.props.match.params.id) });
        }
    }
    
    toggleProp(prop) {
        return () => this.setState({ [prop]: !this.state[prop] });
    }
    
    renderCustomLeadFields() {
        const { lead } = this.state;
        const customFields = [];
        
        if (lead.customFields.length) {
            for (let prop in lead.customFields[0]) {
                customFields.push([prop, lead.customFields[0][prop]]);
            }
        }
        
        
        /*for (let key in lead) {
            if (key === 'customFields') {
                if (lead[key][0]) {
                    let customFields = lead[key][0];
                    for (let prop in customFields) {
                        fields.push([prop, customFields[prop]]);
                    }
                }
            } else {
                if ((key !== '_id') && (key !== 'lat') && (key !== 'lng') && (key !== 'areaId') && (key !== 'leadStatusId') && (key !== 'createdBy') && lead[key]) {
                    fields.push([key, lead[key]]);
                }
            }
        }*/
        if (customFields.length) {
            return (
                <div>
                    <h2>Other</h2>
                    <hr />
                    {
                        customFields.map(field => {
                            return (
                                <div key={ field[0] }>
                                    <h4>{ formatLabel(field[0]) }</h4>
                                    <p>{ field[1] }</p>
                                </div>
                            );
                        })
                    }
                </div>
            );
        } else { return null; }
        
    }
    
    render() {
        const {
            props: {
                //role,
                //isReadOnly,
                history
            },
            state: { isLoading, editModalShown, lead }
        } = this;
        
        const contentAccess = true //((role === ADMIN || (role === SU) || ()) && !isReadOnly);
        
        if (isLoading) return <Loading />;
        
        return (
            <div>
                <main id="user-show" className="content">
                    <ContentHeader title={ lead.firstName + ' ' + lead.lastName } history={ history } chilrenAccess={ contentAccess }>
                        <IconLink clickEvent={ this.toggleProp('editModalShown') } icon="edit" />
                    </ContentHeader>
                    <section className="card">
                        <section>
                            <h2>Contact Info</h2>
                            <hr />
                            <h4>Address</h4>
                            <p>{ `${ lead.address } ${ lead.city }, ${ lead.state } ${ lead.zipcode }` }</p>
                            <h4>Primary Phone</h4>
                            <p>{ lead.primaryPhone || 'NA' }</p>
                            <h4>Secondary Phone</h4>
                            <p>{ lead.secondaryPhone || 'NA' }</p>
                            <h4>Email</h4>
                            <p>{ lead.secondaryPhone || 'NA' }</p>
                            
                            <h2>Lead Info</h2>
                            <hr />
                            <h4>Assigned User</h4>
                            <p>{ lead.assignedUserName }</p>
                            <h4>Created By</h4>
                            <p>{ lead.createdByName }</p>
                            <h4>Containing Area</h4>
                            <p>{ lead.area || 'NA' }</p>
                            <h4>Created At</h4>
                            <p>{ lead.createdAt }</p>
                            <h4>Last Updated</h4>
                            <p>{ lead.updatedAt }</p>
                            
                            { this.renderCustomLeadFields() }
                        </section>
                    </section>
                    <h2>Appointments and Notes</h2>
                </main>
                <Modal close={ this.toggleProp('editModalShown') } shown={ editModalShown } title="Edit Lead">
                    {
                        editModalShown
                            ? (
                                <LeadEdit
                                    close={ this.toggleProp('editModalShown') }
                                    lead={ lead }
                                />
                            ) : ''
                    }
                </Modal>
            </div>
            
        );
    }
}

const mapStateToProps = state => ({
    leads: state.leads.leads,
    //role: state.auth.role,
    //isReadOnly: state.auth.isReadOnly
});

export default connect(mapStateToProps, { fetchLeads, fetchLeadFields, fetchLeadStatuses, fetchUsers, clearLeads })(LeadShow);