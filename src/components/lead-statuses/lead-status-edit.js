import React from 'react';
import { connect } from 'react-redux';

import { required, unique, validate, formSubmit, initializeForm } from '../helpers/forms';

import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';
import FieldColor from '../forms/field-color';

import { updateLeadStatus, fetchLeadStatuses, clearLeadStatuses } from '../../actions/lead-statuses.action';
import { sendMessage } from '../../actions/flash.action';

class LeadStatusEdit extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearLeadStatuses();
        
        this.validationRules = Object.freeze({
            title: [required, unique],
            type: [required],
            color: [required],
            order: [required]
        });
        
        this.state = {
            fields: {
                title: { value: '', error: '' },
                type: { value: '', error: '' },
                order: { value: '', error: '' },
                color: { value: '', error: '' }
            },
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.increaseOrder = this.increaseOrder.bind(this);
        this.decreaseOrder = this.decreaseOrder.bind(this);
    }
    
    componentDidMount() {
        this.setState({ fields: initializeForm({ ...this.state.fields }, this.props.leadStatus) });
    }
    
    componentDidUpdate() {
        const {
            props: { success, message, sendMessage, fetchLeadStatuses, close, clearLeadStatuses, updated },
        } = this;
        
        if (success && updated) {
            sendMessage(message);
            close();
            clearLeadStatuses();
            fetchLeadStatuses();
        }
    }

    handleUserInput(e) {
        const { state: { fields }, props: { sortedStatuses }, validationRules } = this
        
        this.setState(
            validate(e, validationRules, { ...fields }, sortedStatuses, null)
        );
    }
    
    handleSubmit(e) {
        
        e.preventDefault();
        
        const { state: { fields }, props: { updateLeadStatus, leadStatus } } = this;
        
        formSubmit({ fields: { ...fields }, action: updateLeadStatus, id: leadStatus._id });
    }
    
    increaseOrder(id) {
        const fields = { ...this.state.fields };
        
        fields.order.value += 1;
        this.props.increaseStatusOrder(id);
        this.setState(
            validate(null, this.validationRules, { ...fields }, this.props.sortedStatuses, this.props.leadStatus)
        );
    }
    
    decreaseOrder(id) {
        const fields = { ...this.state.fields };
        
        fields.order.value =  fields.order.value - 1;
        this.props.decreaseStatusOrder(id);
        this.setState(
            validate(null, this.validationRules, { ...fields }, this.props.sortedStatuses, this.props.leadStatus)
        );
    }
    
    render() {
        const {
            state: { fields: { title, type, order, color }, formValid },
            props: { leadStatus },
            handleUserInput, handleSubmit, increaseOrder, decreaseOrder
        } = this;
        
        //make const and add to lib including for model
        const typeOptions = [['Select a Type', ''], 'Uncontacted', 'Contacted', 'Qualified', 'Sold', 'No Sale'];
        
        return (
            <tr>
                <td colSpan="4">
                    <form className="inline-form" style={{ display: 'flex', justifyContent: 'space-between' }} onSubmit={ handleSubmit }>

                            <i onClick={ () => increaseOrder(leadStatus._id) } style={{ fontSize: '3rem', marginTop: '.75rem' }} className="fas fa-caret-down"></i>
                            <i onClick={ () => decreaseOrder(leadStatus._id) } style={{ fontSize: '3rem', marginTop: '.75rem' }} className="fas fa-caret-up"></i>

                        <FieldColor
                            name="color"
                            value={ color.value }
                            handleUserInput={ handleUserInput }
                            error={ color.error }
                        />
                        <FieldInput
                            name="title"
                            type="text"
                            placeholder="title"
                            value={ title.value }
                            handleUserInput={ handleUserInput }
                            error={ title.error }
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
    message: state.leadStatuses.message,
    success: state.leadStatuses.success,
    updated: state.leadStatuses.updated
});

export default connect(mapStateToProps, { updateLeadStatus, sendMessage, clearLeadStatuses, fetchLeadStatuses })(LeadStatusEdit);