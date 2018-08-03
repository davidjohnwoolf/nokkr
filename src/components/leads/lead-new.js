import React from 'react';
import { connect } from 'react-redux';

import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
//import IconLink from '../layout/icon-link';
import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';
import FieldCheckbox from '../forms/field-checkbox';
import SubmitBlock from '../forms/submit-block';

import { createLead, clearLeads, fetchLeads } from '../../actions/leads.action';
import { sendMessage } from '../../actions/flash.action';

import { required, email, unique, validate, formSubmit } from '../helpers/forms';
import { ADMIN, MANAGER, USER } from '../../../lib/constants';
import { capitalize } from '../../../lib/functions';

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
            email: [email],
            primaryPhone: [/*phone*/],
            secondaryPhone: [/*phone*/]
        });
        
        this.state = {
            fields: {
                firstName: { value: '', error: '' },
                lastName: { value: '', error: '' },
                address: { value: '', error: '' },
                city: { value: '', error: '' },
                state: { value: '', error: '' },
                zipcode: { value: '', error: '' },
                email: { value: '', error: '' },
                primaryPhone: { value: '', error: '' },
                secondaryPhone: { value: '', error: '' }
            },
            isLoading: true,
            uniqueCandidateList: null,
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchLeads();
    }
    
    componentDidUpdate() {
        const {
            props: { success, message, history, sendMessage, leadId, leads },
            state: { isLoading }
        } = this;
        
        if (leads && isLoading) {
            this.setState({
                isLoading: false,
                uniqueCandidateList: leads
            });
        }
        
        if (success) {
            sendMessage(message);
            history.push(`/leads/${ leadId }`);
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
                fields: {
                    firstName,
                    lastName,
                    address,
                    city,
                    state,
                    zipcode,
                    email,
                    primaryPhone,
                    secondaryPhone
                }
            },
            handleSubmit,
            handleUserInput
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <div>
                <form onSubmit={ handleSubmit }>
                
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
                        options={[
                            ['Select State', ''],
                            ['Utah', 'Utah'],
                            ['Oregon', 'Oregon']
                        ]}
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
                        type="primaryPhone"
                        placeholder="phone"
                        value={ primaryPhone.value }
                        handleUserInput={ handleUserInput }
                        error={ primaryPhone.error }
                    />
                    <FieldInput
                        name="secondaryPhone"
                        type="secondaryPhone"
                        placeholder="phone"
                        value={ secondaryPhone.value }
                        handleUserInput={ handleUserInput }
                        error={ secondaryPhone.error }
                    />
                    
                    <button type="submit" disabled={ !formValid } className="button success">Save Area</button>
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
    leads: state.leads.leads
});

export default connect(mapStateToProps, { fetchLeads, clearLeads, createLead, sendMessage })(LeadNew);