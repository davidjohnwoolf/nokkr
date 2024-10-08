import React from 'react';
import { connect } from 'react-redux';

import { required, unique, validate, formSubmit } from '../helpers/forms';

import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';
import FieldColor from '../forms/field-color';

import { createLeadStatus, fetchLeadStatuses, clearLeadStatuses } from '../../actions/lead-statuses.action';
import { sendMessage } from '../../actions/flash.action';

class LeadStatusNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearLeadStatuses();
        
        this.validationRules = Object.freeze({
            title: [required, unique],
            type: [required],
            color: [required],
            order: [required]
        });
        
        this.state = this.getInitialState();

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    getInitialState() {
        return {
            fields: {
                title: { value: '', error: '' },
                type: { value: '', error: '' },
                order: { value: '', error: '' },
                color: { value: '#1e80c6', error: '' }
            },
            formValid: false
        }
    }
    
    componentDidUpdate() {
        const {
            props: { success, message, sendMessage, fetchLeadStatuses, close, clearLeadStatuses, created },
        } = this;
        
        if (success && created) {
            sendMessage(message);
            close();
            clearLeadStatuses();
            fetchLeadStatuses();
            this.setState(this.getInitialState());
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
        
        const { state: { fields }, props: { createLeadStatus } } = this;
        
        formSubmit({ fields: { ...fields }, action: createLeadStatus });
    }
    
    render() {
        const {
            state: { fields: { title, type, order, color }, formValid },
            props: { orderOptions },
            handleUserInput, handleSubmit
        } = this;
        
        //make const and add to lib including for model
        const typeOptions = [['Select a Type', ''], 'Uncontacted', 'Contacted', 'Qualified', 'Sold', 'No Sale'];
        
        //meant to render in modal
        return (
            <div>
                <form onSubmit={ handleSubmit }>
                
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
                    <FieldColor
                        name="color"
                        label="Select a Color"
                        value={ color.value }
                        handleUserInput={ handleUserInput }
                        error={ color.error }
                    />
                    <FieldSelect
                        name="order"
                        value={ order.value }
                        handleUserInput={ handleUserInput }
                        error={ order.error }
                        options={ orderOptions }
                    />
    
                    <button
                        disabled={ !formValid }
                        className="button success"
                        type="submit">
                        Save
                    </button>
                </form>
                <button onClick={ this.props.close } className="button cancel">Cancel</button>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    message: state.leadStatuses.message,
    success: state.leadStatuses.success,
    created: state.leadStatuses.created
});

export default connect(mapStateToProps, { createLeadStatus, clearLeadStatuses, fetchLeadStatuses, sendMessage })(LeadStatusNew);