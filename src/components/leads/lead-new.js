import React from 'react';
import { connect } from 'react-redux';

import Loading from '../layout/loading';
//import IconLink from '../layout/icon-link';
import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';

import { createLead, clearLeads, fetchLeads } from '../../actions/leads.action';
import { sendMessage } from '../../actions/flash.action';

import { validate, formSubmit, formSubmit2, buildFields, customValidate } from '../helpers/forms';
import { LEAD_FORM_MODEL } from '../helpers/form-models';

class LeadNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearLeads();
        
        this.state = this.getInitialState();

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.customHandleUserInput = this.customHandleUserInput.bind(this);
    }
    
    getInitialState() {
        return {
            fields: LEAD_FORM_MODEL.map(field => Object.create(field)),
            customFields: null,
            isLoading: true,
            uniqueCandidateList: null,
            formValid: false
        };
    }
    
    componentDidUpdate(prevProps) {
        const {
            props: {
                success,
                message,
                clearLeads,
                close,
                sendMessage,
                leads,
                sessionId,
                address,
                city,
                state,
                zipcode,
                latLng,
                hasAddress,
                leadStatuses,
                fetchLeads,
                created,
                leadFields
            },
            state: { isLoading },
            getInitialState
        } = this;
        
        if (leads && leadStatuses && leadFields && isLoading) {
            const fields = this.state.fields.map(field => Object.create(field));
            const customFields = [];
            
            fields.find(field => field.name === 'userId').value = sessionId;
            
            leadStatuses.forEach(status => {
                fields.find(field => field.name === 'leadStatusId').options.push([status.title, status._id]);
            });
            
            leadFields.forEach(field => {
                if (field.isActive) {
                    switch(field.type) {
                        case 'Checkbox':
                            customFields.push({
                                name: field.name,
                                label: field.label,
                                type: field.type.toLowerCase(),
                                rules: [],
                                value: '',
                                error: ''
                            });
                            break;
                        
                        case 'Select':
                            customFields.push({
                                name: field.name,
                                label: field.label,
                                type: field.type.toLowerCase(),
                                rules: [],
                                options: field.options,
                                value: '',
                                error: ''
                            });
                            break;
                        
                        case 'Text Area':
                            customFields.push({
                                name: field.name,
                                label: field.label,
                                type: 'textarea',
                                rules: [],
                                value: '',
                                error: ''
                            });
                            break;
                        
                        default:
                            customFields.push({
                                name: field.name,
                                label: field.label,
                                type: field.type.toLowerCase(),
                                rules: [],
                                value: '',
                                error: ''
                            });
                    }
                }
            });
            
            this.setState({
                isLoading: false,
                fields,
                customFields,
                uniqueCandidateList: leads
            });
        }
        
        if (prevProps.hasAddress !== hasAddress) {
            const fields = this.state.fields.map(field => Object.create(field));
            
            if (hasAddress) {
                fields.find(field => field.name === 'address').value = address;
                fields.find(field => field.name === 'city').value = city;
                fields.find(field => field.name === 'state').value = state;
                fields.find(field => field.name === 'zipcode').value = zipcode;
                fields.find(field => field.name === 'lat').value = latLng.lat();
                fields.find(field => field.name === 'lng').value = latLng.lng();
                
                this.props.areas.forEach(area => {
                    let polygon = new window.google.maps.Polygon({ paths: area.coords });
                    
                    if (window.google.maps.geometry.poly.containsLocation(latLng, polygon)) {
                        fields.find(field => field.name === 'areaId').value = area._id;
                    }
                });
                
            } else {
                //clear fields
                fields.forEach(field => {
                    if (field.name !== 'userId') {
                        field.value = '';
                    }
                })
            }
            
            this.setState({ fields });
        }
        
        if (success && created) {
            sendMessage(message);
            clearLeads();
            fetchLeads();
            close();
            this.setState(getInitialState())
        }
    }
    
    handleUserInput(e) {
        const { validationRules, state: { fields, uniqueCandidateList } } = this;
        
        this.setState(
            validate(e, validationRules, { ...fields }, uniqueCandidateList, null)
        );
    }
    
    customHandleUserInput(event) {
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
            props: { close },
            state: {
                formValid,
                isLoading,
                leadStatusOptions,
                customFields,
                fields
            },
            handleSubmit,
            customHandleUserInput
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <div>
                <form onSubmit={ handleSubmit }>
                    
                    { buildFields({ fields: fields.concat(customFields), handleUserInput: customHandleUserInput }) }
                    
                    <button type="submit" disabled={ !formValid } className="button success">Save Lead</button>
                </form>
                <button onClick={ close } className="button cancel">Cancel</button>
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
    sessionId: state.auth.sessionId
});

export default connect(mapStateToProps, { fetchLeads, clearLeads, createLead, sendMessage })(LeadNew);