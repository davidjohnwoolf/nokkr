import React from 'react';
import { connect } from 'react-redux';

import Loading from '../layout/loading';

import { createLead, clearLeads, fetchLeads } from '../../actions/leads.action';
import { sendMessage } from '../../actions/flash.action';

import { formSubmit2, buildFields, buildCustomFieldsModel, customValidate } from '../helpers/forms';
import { LEAD_FORM_MODEL } from '../helpers/form-models';

class LeadNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearLeads();
        
        this.state = {
            fields: null,
            customFields: null,
            isLoading: true,
            uniqueCandidateList: null,
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidMount() {
        const {
            props: {
                leads,
                sessionId,
                address,
                city,
                state,
                zipcode,
                latLng,
                hasAddress,
                leadStatuses,
                leadFields,
                users,
                areas
            },
            state: { isLoading }
        } = this;
        
        if (leads && users && leadStatuses && leadFields && areas && isLoading) {
            const fields = LEAD_FORM_MODEL.map(field => Object.create(field));
            const leadStatusOptions = [];
            const userOptions = [];
            
            leadStatuses.forEach(status => leadStatusOptions.push([status.title, status._id]));
            users.forEach(user => userOptions.push([user.firstName + ' ' + user.lastName, user._id]));
            
            fields.find(field => field.name === 'leadStatusId').options = leadStatusOptions;
            fields.find(field => field.name === 'userId').options = userOptions;
            fields.find(field => field.name === 'userId').value = sessionId;
            
            if (hasAddress) {
                fields.find(field => field.name === 'address').value = address;
                fields.find(field => field.name === 'city').value = city;
                fields.find(field => field.name === 'state').value = state;
                fields.find(field => field.name === 'zipcode').value = zipcode;
                fields.find(field => field.name === 'lat').value = latLng.lat();
                fields.find(field => field.name === 'lng').value = latLng.lng();
                
                areas.forEach(area => {
                    let polygon = new window.google.maps.Polygon({ paths: area.coords });
                    
                    if (window.google.maps.geometry.poly.containsLocation(latLng, polygon)) {
                        fields.find(field => field.name === 'areaId').value = area._id;
                    }
                });
            }
            
            this.setState({
                isLoading: false,
                fields,
                customFields: buildCustomFieldsModel(leadFields),
                uniqueCandidateList: leads
            });
            
        }
    }
    
    componentDidUpdate() {
        const {
            success,
            message,
            clearLeads,
            close,
            sendMessage,
            fetchLeads,
            created
        } = this.props;
        
        if (success && created) {
            sendMessage(message);
            clearLeads();
            fetchLeads();
            close();
        }
    }
    
    handleUserInput(event) {
        const { state: { fields, customFields, uniqueCandidateList: candidates } } = this;
        
        this.setState(
            customValidate({
                event,
                fields: fields.map(field => Object.create(field)),
                customFields: customFields.map(field => Object.create(field)),
                candidates,
                data: null
            })
        );
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const { state: { fields, customFields }, props: { createLead } } = this;
        
        formSubmit2({ fields, customFields, action: createLead });
    }
    
    render() {
        const {
            state: {
                formValid,
                isLoading,
                customFields,
                fields
            },
            handleSubmit,
            handleUserInput
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <div>
                <form onSubmit={ handleSubmit }>
                    
                    { buildFields({ fields: fields.concat(customFields), handleUserInput }) }
                    
                    <button type="submit" disabled={ !formValid } className="button success">Save Lead</button>
                </form>
                <button onClick={ this.props.close } className="button cancel">Cancel</button>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    message: state.leads.message,
    leadId: state.leads.leadId,
    success: state.leads.success,
    created: state.leads.created,
    areas: state.areas.areas,
    leads: state.leads.leads,
    leadStatuses: state.leadStatuses.leadStatuses,
    leadFields: state.leadFields.leadFields,
    users: state.users.users,
    sessionId: state.auth.sessionId
});

export default connect(mapStateToProps, { fetchLeads, clearLeads, createLead, sendMessage })(LeadNew);