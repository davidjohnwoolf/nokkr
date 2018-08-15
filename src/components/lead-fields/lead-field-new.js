import React from 'react';
import { connect } from 'react-redux';

import { required, unique, validate, formSubmit } from '../helpers/forms';

import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';
import FieldCheckbox from '../forms/field-checkbox';

import { createLeadField, fetchLeadFields, clearLeadFields } from '../../actions/lead-fields.action';
import { sendMessage } from '../../actions/flash.action';

class LeadFieldNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearLeadFields();
        
        this.validationRules = Object.freeze({
            label: [required, unique],
            name: [required, unique],
            type: [required],
            order: [required],
            options: [/*requiredIfTypeSelect*/],
            isActive: [],
        });
        
        this.state = this.getInitialState();

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    getInitialState() {
        return {
            fields: {
                label: { value: '', error: '' },
                name: { value: '', error: '' },
                type: { value: '', error: '' },
                order: { value: '', error: '' },
                options: { value: '', error: '' }, //update validation to include arrays
                isActive: { checked: true, error: '' }
            },
            formValid: false
        }
    }
    
    componentDidUpdate() {
        const {
            props: { success, message, sendMessage, fetchLeadFields, close, clearLeadFields, created },
        } = this;
        
        if (success && created) {
            sendMessage(message);
            close();
            clearLeadFields();
            fetchLeadFields();
            this.setState(this.getInitialState());
        }
    }

    handleUserInput(e) {
        const { state: { fields }, props: { sortedStatuses }, validationRules } = this;
        
        fields.name.value = fields.label.value.toLowerCase().replace(/[^\w]/gi, '');
        
        this.setState(
            validate(e, validationRules, { ...fields }, sortedStatuses, null)
        );
    }
    
    handleSubmit(e) {
        
        e.preventDefault();
        
        const { state: { fields }, props: { createLeadField } } = this;
        
        formSubmit({ fields: { ...fields }, action: createLeadField });
    }
    
    render() {
        const {
            state: { fields: { label, type, order, isActive }, formValid },
            props: { orderOptions },
            handleUserInput, handleSubmit
        } = this;
        
        //make const and add to lib including for model
        const typeOptions = [['Select a Type', ''], 'Text', 'Select', 'Checkbox', 'Date', 'Email', 'Text Area'];
        
        //meant to render in modal
        return (
            <tr>
                <td colSpan="4">
                    <form style={{ display: 'flex', justifyContent: 'space-between' }} onSubmit={ handleSubmit }>
                        
                        <FieldCheckbox
                            name="isActive"
                            label="Active"
                            value="true"
                            checked={ isActive.checked }
                            handleUserInput={ handleUserInput }
                            error={ isActive.error }
                        />
                        <FieldSelect
                            name="order"
                            value={ order.value }
                            handleUserInput={ handleUserInput }
                            error={ order.error }
                            options={ orderOptions }
                        />
                        <FieldInput
                            name="label"
                            type="text"
                            placeholder="label"
                            value={ label.value }
                            handleUserInput={ handleUserInput }
                            error={ label.error }
                        />
                        <FieldSelect
                            name="type"
                            value={ type.value }
                            handleUserInput={ handleUserInput }
                            error={ type.error }
                            options={ typeOptions }
                        />
                        
                        <button
                            style={{ marginTop: '1rem', padding: '1rem', height: '3.5rem', background: '#10a887', color: '#fff', border: 'none', cursor: 'pointer' }}
                            disabled={ !formValid }
                            type="submit"
                        >
                            <i style={{ fontSize: '1.5rem'}} className="fas fa-check"></i>
                        </button>
                        <span
                            style={{ marginTop: '1rem', padding: '1rem', height: '3.5rem', background: '#999', color: '#fff', border: 'none', cursor: 'pointer' }}
                            onClick={ this.props.close }
                        >
                            <i style={{ fontSize: '1.5rem'}} className="fas fa-times"></i>
                        </span>
                        <span
                            style={{ marginTop: '1rem', padding: '1rem', height: '3.5rem', background: '#da3c3c', color: '#fff', border: 'none', cursor: 'pointer' }}
                            onClick={ () => console.log('delete it') }
                        >
                            <i style={{ fontSize: '1.5rem'}} className="fas fa-trash"></i>
                        </span>
                    </form>
                </td>
            </tr>
        );
    }
}

const mapStateToProps = state => ({
    message: state.leadFields.message,
    success: state.leadFields.success,
    created: state.leadFields.created
});

export default connect(mapStateToProps, { createLeadField, clearLeadFields, fetchLeadFields, sendMessage })(LeadFieldNew);