import React from 'react';
import { connect } from 'react-redux';

import Loading from '../layout/loading';
//import IconLink from '../layout/icon-link';
import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';

import { createLead, clearLeads, fetchLeads } from '../../actions/leads.action';
import { sendMessage } from '../../actions/flash.action';

import { required, unique, validate, formSubmit } from '../helpers/forms';
import stateArray from '../helpers/state-array';

class LeadNew extends React.Component {
    
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
            areaId: [],
            email: [],
            primaryPhone: [],
            secondaryPhone: [],
            leadStatusId: [required],
            lat: [required],
            lng: [required]
        });
        
        this.state = this.getInitialState();

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    getInitialState() {
        return {
            fields: {
                firstName: { value: '', error: '' },
                lastName: { value: '', error: '' },
                address: { value: '', error: '' },
                city: { value: '', error: '' },
                state: { value: '', error: '' },
                zipcode: { value: '', error: '' },
                email: { value: '', error: '' },
                primaryPhone: { value: '', error: '' },
                secondaryPhone: { value: '', error: '' },
                leadStatusId: { value: '', error: '' },
                userId: { value: '', error: '' },
                areaId: { value: '', error: '' },
                lat: { value: '', error: '' },
                lng: { value: '', error: '' }
            },
            isLoading: true,
            uniqueCandidateList: null,
            leadStatusOptions: null,
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
                created
            },
            state: { isLoading },
            getInitialState
        } = this;
        
        if (leads && leadStatuses && isLoading) {
            const fields = { ...this.state.fields };
            
            fields.userId.value = sessionId;
            
            const leadStatusOptions = [['Select a Status', '']];
            
            leadStatuses.forEach(status => {
                leadStatusOptions.push([status.title, status._id]);
            });
            
            this.setState({
                isLoading: false,
                fields,
                leadStatusOptions,
                uniqueCandidateList: leads
            });
        }
        
        if (prevProps.hasAddress !== hasAddress) {
            const fields = { ...this.state.fields };
            
            if (hasAddress) {
                fields.address.value = address;
                fields.city.value = city;
                fields.state.value = state;
                fields.zipcode.value = zipcode;
                fields.lat.value = latLng.lat();
                fields.lng.value = latLng.lng();
                
                this.props.areas.forEach(area => {
                    let polygon = new window.google.maps.Polygon({ paths: area.coords });
                    
                    if (window.google.maps.geometry.poly.containsLocation(latLng, polygon)) {
                        fields.areaId.value = area._id;
                    }
                });
                
                //google.maps.geometry.poly.containsLocation(e.latLng, bermudaTriangle)
            } else {
                for (let field in fields) {
                    //clear fields
                    if (field !== 'userId') {
                        fields[field].value = '';
                    }
                }
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
    
    handleSubmit(e) {
        e.preventDefault();
        
        const { state: { fields }, props: { createLead } } = this;
        
        formSubmit({ fields: { ...fields }, action: createLead });
    }
    
    render() {
        const {
            props: { close },
            state: {
                formValid,
                isLoading,
                leadStatusOptions,
                fields: {
                    firstName,
                    lastName,
                    address,
                    city,
                    state,
                    zipcode,
                    email,
                    primaryPhone,
                    secondaryPhone,
                    leadStatusId
                }
            },
            handleSubmit,
            handleUserInput
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <div>
                <form onSubmit={ handleSubmit }>
                    
                    <FieldSelect
                        name="leadStatusId"
                        value={ leadStatusId.value }
                        handleUserInput={ handleUserInput }
                        error={ leadStatusId.error }
                        options={ leadStatusOptions }
                    />
                    <FieldInput
                        name="firstName"
                        type="text"
                        placeholder="first name"
                        value={ firstName.value }
                        handleUserInput={ handleUserInput }
                        error={ firstName.error }
                    />
                    <FieldInput
                        name="lastName"
                        type="text"
                        placeholder="last name"
                        value={ lastName.value }
                        handleUserInput={ handleUserInput }
                        error={ lastName.error }
                    />
                    <FieldInput
                        name="address"
                        type="text"
                        placeholder="address"
                        value={ address.value }
                        handleUserInput={ handleUserInput }
                        error={ address.error }
                    />
                    <FieldInput
                        name="city"
                        type="city"
                        placeholder="city"
                        value={ city.value }
                        handleUserInput={ handleUserInput }
                        error={ city.error }
                    />
                    <FieldSelect
                        name="state"
                        value={ state.value }
                        handleUserInput={ handleUserInput }
                        error={ state.error }
                        options={ stateArray }
                    />
                    <FieldInput
                        name="zipcode"
                        type="zipcode"
                        placeholder="zipcode"
                        value={ zipcode.value }
                        handleUserInput={ handleUserInput }
                        error={ zipcode.error }
                    />
                    <FieldInput
                        name="email"
                        type="email"
                        placeholder="email"
                        value={ email.value }
                        handleUserInput={ handleUserInput }
                        error={ email.error }
                    />
                    <FieldInput
                        name="primaryPhone"
                        type="tel"
                        placeholder="primary phone"
                        value={ primaryPhone.value }
                        handleUserInput={ handleUserInput }
                        error={ primaryPhone.error }
                    />
                    <FieldInput
                        name="secondaryPhone"
                        type="tel"
                        placeholder="secondary phone"
                        value={ secondaryPhone.value }
                        handleUserInput={ handleUserInput }
                        error={ secondaryPhone.error }
                    />
                    
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
    sessionId: state.auth.sessionId
});

export default connect(mapStateToProps, { fetchLeads, clearLeads, createLead, sendMessage })(LeadNew);