import React from 'react';
import { connect } from 'react-redux';

import { required, unique, validate } from '../helpers/forms';
import FieldInput from '../forms/field-input';
import FieldColor from '../forms/field-color';
import { fetchAreaGroups, createAreaGroup, clearAreaGroup } from '../../actions/area-groups.action';
import { sendMessage } from '../../actions/flash.action';

class AreaGroupNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearAreaGroup();

        props.fetchAreaGroups();
        
        this.validationRules = Object.freeze({
            title: [required, unique],
            color: [required]
        });
        
        this.state = {
            fields: {
                title: { value: '', error: '' },
                color: { value: '#1e80c6', error: '' }
            },
            isInitialized: false,
            uniqueCandidateList: [],
            formValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        const { areaGroups } = nextProps;
        const { isInitialized } = prevState;
        
        if (!isInitialized && areaGroups) {
            
            return { uniqueCandidateList: areaGroups, isInitialized: true };
            
        } else {
            return prevState;
        }
    }
    
    componentDidUpdate() {
        const { success, message, sendMessage } = this.props;
        
        if (success) {
            sendMessage(message);
        }
    }
    
    handleUserInput(e) {
        this.setState(
            validate(e, this.validationRules, { ...this.state.fields }, this.state.uniqueCandidateList, null)
        );
    }
    
    handleSubmit(e) {
        
        e.preventDefault();
        
        const areaGroupData = { ...this.state.fields };
        
        //convert fields obj into user obj
        for (let key in areaGroupData) {
            areaGroupData[key] = areaGroupData[key].value;
        }
        
        this.props.createAreaGroup(areaGroupData);
    }
    
    render() {
        const { title, color } = this.state.fields;
        const { handleSubmit, handleUserInput } = this;
        
        //render in modal
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
                
                <div className="btn-group">
                    <button
                        disabled={ !this.state.formValid }
                        className="btn btn-success"
                        type="submit">
                        Save
                    </button>
                </div>
            </form>
        );
    }
}

const mapStateToProps = state => ({
    message: state.areaGroups.message,
    success: state.areaGroups.success,
    areaGroups: state.areaGroups.areaGroups
});

export default connect(mapStateToProps, { fetchAreaGroups, createAreaGroup, sendMessage, clearAreaGroup })(AreaGroupNew);