import React from 'react';
import { connect } from 'react-redux';

import { required, unique, validate, formSubmit, initializeForm } from '../helpers/forms';

import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';
import FieldCheckbox from '../forms/field-checkbox';

import { updateLeadField, fetchLeadFields, clearLeadFields } from '../../actions/lead-fields.action';
import { sendMessage } from '../../actions/flash.action';

class LeadFieldEdit extends React.Component {
    
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
        
        this.state = {
            fields: {
                label: { value: '', error: '' },
                name: { value: '', error: '' },
                type: { value: '', error: '' },
                order: { value: '', error: '' },
                options: { value: '', error: '' }, //update validation to include arrays
                isActive: { checked: true, error: '' }
            },
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.increaseOrder = this.increaseOrder.bind(this);
        this.decreaseOrder = this.decreaseOrder.bind(this);
    }
    
    componentDidMount() {
        this.setState({ fields: initializeForm({ ...this.state.fields }, this.props.leadField) });
    }
    
    componentDidUpdate() {
        const {
            props: { success, message, sendMessage, fetchLeadFields, close, clearLeadFields, updated },
        } = this;
        
        if (success && updated) {
            sendMessage(message);
            close();
            clearLeadFields();
            fetchLeadFields();
        }
    }

    handleUserInput(e) {
        const { state: { fields }, props: { sortedStatuses }, validationRules } = this;
        
        fields.name.value = fields.label.value.toLowerCase().replace(/[^\w]/gi, '');
        
        this.setState(
            validate(e, validationRules, { ...fields }, sortedStatuses, this.props.leadField)
        );
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const { state: { fields }, props: { updateLeadField, leadField } } = this;
        
        formSubmit({ fields: { ...fields }, action: updateLeadField, id: leadField._id });
    }
    
    increaseOrder(id) {
        const fields = { ...this.state.fields };
        
        fields.order.value += 1;
        this.props.increaseFieldOrder(id);
        this.setState(
            validate(null, this.validationRules, { ...fields }, this.props.sortedStatuses, this.props.leadField)
        );
    }
    
    decreaseOrder(id) {
        const fields = { ...this.state.fields };
        
        fields.order.value =  fields.order.value - 1;
        this.props.decreaseFieldOrder(id);
        this.setState(
            validate(null, this.validationRules, { ...fields }, this.props.sortedStatuses, this.props.leadField)
        );
    }
    
    render() {
        const {
            state: { fields: { label, type, isActive, order }, formValid },
            props: { leadField, leadFields },
            handleUserInput, handleSubmit, increaseOrder, decreaseOrder
        } = this;
        
        //make const and add to lib including for model
        const typeOptions = [['Select a Type', ''], 'Text', 'Select', 'Checkbox', 'Date', 'Email', 'Text Area'];
        
        //meant to render in modal
        return (
            <tr>
                <td colSpan="4">
                    <form style={{ display: 'flex', justifyContent: 'space-between' }} onSubmit={ handleSubmit }>
                    
                        {
                            order.value > 1
                                ? (
                                    <i
                                        onClick={ () => decreaseOrder(leadField._id) }
                                        style={{ fontSize: '3rem', marginTop: '.75rem', cursor: 'pointer' }}
                                        className="fas fa-caret-up">
                                    </i>
                                ) : (
                                    <i
                                        style={{ fontSize: '3rem', marginTop: '.75rem', color: '#999' }}
                                        className="fas fa-caret-up">
                                    </i>
                                )
                        }
                        {
                            order.value < leadFields.length
                                ? (
                                    <i
                                        onClick={ () => increaseOrder(leadField._id) }
                                        style={{ fontSize: '3rem', marginTop: '.75rem', cursor: 'pointer' }}
                                        className="fas fa-caret-down">
                                    </i>
                                ) : (
                                    <i
                                        style={{ fontSize: '3rem', marginTop: '.75rem', color: '#999' }}
                                        className="fas fa-caret-down">
                                    </i>
                                )
                        }
                        
                        <FieldCheckbox
                            name="isActive"
                            label="Active"
                            value="true"
                            checked={ isActive.checked }
                            handleUserInput={ handleUserInput }
                            error={ isActive.error }
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
    leadFields: state.leadFields.leadFields,
    updated: state.leadFields.updated
});

export default connect(mapStateToProps, { updateLeadField, clearLeadFields, fetchLeadFields, sendMessage })(LeadFieldEdit);