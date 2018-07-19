import React from 'react';
import { connect } from 'react-redux';

import { required, unique, validate, formSubmit } from '../helpers/forms';
import FieldInput from '../forms/field-input';
import FieldColor from '../forms/field-color';
import { createAreaGroup } from '../../actions/area-groups.action';
import { sendMessage } from '../../actions/flash.action';

class AreaGroupNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.validationRules = Object.freeze({
            title: [required, unique],
            color: [required]
        });
        
        this.state = {
            fields: {
                title: { value: '', error: '' },
                color: { value: '#1e80c6', error: '' }
            },
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUserInput(e) {
        const { state: { fields }, props: { areaGroups }, validationRules } = this
        
        this.setState(
            validate(e, validationRules, { ...fields }, areaGroups, null)
        );
    }
    
    handleSubmit(e) {
        
        e.preventDefault();
        
        const { state: { fields }, props: { createAreaGroup } } = this;
        
        formSubmit({ fields: { ...fields }, action: createAreaGroup });
    }
    
    render() {
        const {state: { fields: { title, color }, formValid }, handleUserInput, handleSubmit } = this;
        
        //meant to render in modal
        return (
            <form onSubmit={ handleSubmit }>
            
                <FieldInput
                    name="title"
                    type="text"
                    placeholder="title"
                    value={ title.value }
                    handleUserInput={ handleUserInput }
                    error={ title.error }
                />
                <FieldColor
                    name="color"
                    label="Select a Color"
                    value={ color.value }
                    handleUserInput={ handleUserInput }
                    error={ color.error }
                />

                <button
                    disabled={ !formValid }
                    className="button success"
                    type="submit">
                    Save
                </button>
            </form>
        );
    }
}

const mapStateToProps = state => ({
    areaGroups: state.areaGroups.areaGroups
});

export default connect(mapStateToProps, { createAreaGroup, sendMessage })(AreaGroupNew);