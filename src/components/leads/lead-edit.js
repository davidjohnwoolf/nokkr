import React from 'react';
import { connect } from 'react-redux';

import Loading from '../layout/loading';
//import IconLink from '../layout/icon-link';
import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';

import { updateLead, clearLeads, fetchLeads } from '../../actions/leads.action';
import { sendMessage } from '../../actions/flash.action';

import { required, unique, formSubmit2, initializeForm2, initializeCustomFields, buildFields, customValidate, buildCustomFieldsModel } from '../helpers/forms';
import { LEAD_FORM_MODEL } from '../helpers/form-models';

class LeadEdit extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearLeads();
        
        this.validationRules = Object.freeze({
            firstName: [required],
            lastName: [required],
            address: [required, unique],
            city: [required],
            state: [required],
            zipcode: [required],
            userId: [required],
            email: [],
            primaryPhone: [],
            secondaryPhone: [],
            leadStatusId: [required],
            lat: [required],
            lng: [required]
        });
        
        this.state = {
            fields: null,
            isLoading: true,
            uniqueCandidateList: null,
            customFields: null,
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidMount() {
        const {
            props: {
                leads,
                leadStatuses,
                leadFields,
                users
            },
            state: { isLoading }
        } = this;
        
        if (leads && users && leadStatuses && leadFields && isLoading) {
            const fields = LEAD_FORM_MODEL.map(field => Object.create(field));
            
            const leadStatusOptions = [];
            const userOptions = [];
            
            leadStatuses.forEach(status => leadStatusOptions.push([status.title, status._id]));
            users.forEach(user => userOptions.push([user.firstName + ' ' + user.lastName, user._id]));
            
            fields.find(field => field.name === 'leadStatusId').options = leadStatusOptions;
            fields.find(field => field.name === 'userId').options = userOptions;
            
            this.setState({
                isLoading: false,
                fields: initializeForm2(fields, this.props.lead),
                customFields: initializeCustomFields(buildCustomFieldsModel(leadFields), this.props.lead),
                uniqueCandidateList: leads
            });
        }
    }
    
    componentDidUpdate() {
        const {
            props: {
                success,
                message,
                clearLeads,
                close,
                sendMessage,
                fetchLeads,
                updated
            }
        } = this;
        
        if (success && updated) {
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
                data: this.props.lead
            })
        );
    }
    
    customHandleUserInput(event) {
        const { state: { customFields, uniqueCandidateList: candidates } } = this;
        
        this.setState(
            customValidate({ event, customFields, candidates, data: null })
        );
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const { state: { fields, customFields }, props: { updateLead, lead } } = this;
        
        formSubmit2({ fields, customFields, action: updateLead, id: lead._id });
    }
    
    render() {
        const {
            props: { close },
            state: {
                formValid,
                isLoading,
                fields,
                customFields
            },
            handleSubmit,
            handleUserInput
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <div>
                <form onSubmit={ handleSubmit }>
                    
                    { buildFields({ fields: fields.concat(customFields), handleUserInput }) }
                    
                    <button type="submit" disabled={ !formValid } className="button success">Update Lead</button>
                </form>
                <button onClick={ close } className="button cancel">Cancel</button>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    message: state.leads.message,
    success: state.leads.success,
    updated: state.leads.updated,
    users: state.users.users,
    leads: state.leads.leads,
    leadStatuses: state.leadStatuses.leadStatuses,
    leadFields: state.leadFields.leadFields
});

export default connect(mapStateToProps, { fetchLeads, clearLeads, updateLead, sendMessage })(LeadEdit);

