import React from 'react';
import { connect } from 'react-redux';

import { required, unique, validate, formSubmit } from '../helpers/forms';
import { AREA_PATH } from '../../../lib/constants';

import AreaGroupNew from '../area-groups/area-group-new';
import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';
import SubmitBlock from '../forms/submit-block';
import Loading from '../layout/loading';

import { createArea } from '../../actions/areas.action';
import { fetchUsers } from '../../actions/users.action';
import { fetchAreaGroups } from '../../actions/area-groups.action';
import { sendMessage } from '../../actions/flash.action';

class AreaNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        //unique candidate list?
        
        this.validationRules = {
            title: [required, unique],
            areaGroupId: [required],
            coords: [required],
            userId: [required]
        };
        
        this.state = {
            fields: {
                title: { value: '', error: '' },
                areaGroupId: { value: '', error: '' },
                coords: { value: props.coords || '', error: '' },
                userId: { value: '', error: '' }
            },
            isLoading: true,
            coords: null,
            formValid: false,
            userOptions: [['Assign User', '']],
            areaGroupOptions: [['Select Group', '']],
            areaList: []
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchUsers();
        this.props.fetchAreaGroups();
    }
    
    componentDidUpdate() {
        const {
            props: {
                success,
                message,
                history,
                sendMessage,
                areaGroupSuccess,
                areaGroupMessage,
                areaId,
                clearAreaGroups,
                fetchAreaGroups,
                areaGroups,
                users
            },
            state: { isLoading }
        } = this;
        
        if (areaGroups && users && isLoading) {
            
            let userOptions = [...this.state.userOptions];
            let areaGroupOptions = [...this.state.areaGroupOptions];
            let areaList = [];
            
            users.forEach(user => {
                if (user.isActive) userOptions.push([user.firstName +' '+ user.lastName, user._id]);
                
                //create area array to display on map
                areaList = areaList.concat(user.areas);
            });
            
            areaGroups.forEach(areaGroup => {
                areaGroupOptions.push([areaGroup.title, areaGroup._id]);
            });
            
            this.setState({
                isLoading: false,
                userOptions,
                areaGroupOptions,
                areaList
            })
        }

        if (success) {
            sendMessage(message);
            history.push(AREA_PATH + areaId);
        }
        
        if (areaGroupSuccess) {
            sendMessage(areaGroupMessage);
            clearAreaGroups();
            fetchAreaGroups();
        }
    }
    
    handleUserInput(e) {
        const { state: { fields, areaList }, validationRules } = this;
        
        this.setState(
            validate(e, validationRules, { ...fields }, areaList, null)
        );
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const { state: { fields }, props: { createArea } } = this;
        
        console.log(fields)
        
        formSubmit({ fields: { ...fields }, action: createArea });
    }

    render() {
        const {
            state: {
                isLoading,
                formValid,
                areaList,
                userOptions,
                areaGroupOptions,
                fields: { title, areaGroupId, userId, coords }
            },
            handleSubmit,
            handleUserInput,
        } = this;
        
        if (isLoading) return <Loading />;
        
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
                        name="areaGroup"
                        value={ areaGroupId.value }
                        handleUserInput={ handleUserInput }
                        error={ areaGroupId.error }
                        options={ areaGroupOptions }
                    />
                    <FieldSelect
                        name="userId"
                        value={ userId.value }
                        handleUserInput={ handleUserInput }
                        error={ userId.error }
                        options={ userOptions }
                    />
                    
                    <input type="hidden" name="coords" value={ coords } />

                    <button type="submit" className="button success">Save Area</button>
                </form>
                <h4>Create Area Group</h4>
                <AreaGroupNew />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    message: state.areas.message,
    success: state.areas.success,
    areaId: state.areas.areaId,
    areas: state.areas.areas,
    users: state.users.users,
    areaGroupSuccess: state.areaGroups.success,
    areaGroupMessage: state.areaGroups.message,
    areaGroups: state.areaGroups.areaGroups
});

export default connect(mapStateToProps, { createArea, fetchUsers, sendMessage, fetchAreaGroups })(AreaNew);