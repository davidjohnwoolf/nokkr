import React from 'react';
import { connect } from 'react-redux';

import { required, unique, validate, formSubmit, initializeForm } from '../helpers/forms';
import { AREA_PATH } from '../../../lib/constants';

import AreaGroupNew from '../area-groups/area-group-new';
import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';
import Loading from '../layout/loading';
import Modal from '../layout/modal';
import IconLink from '../layout/icon-link';

import { updateArea } from '../../actions/areas.action';
import { fetchUsers } from '../../actions/users.action';
import { clearAreaGroups, fetchAreaGroups } from '../../actions/area-groups.action';
import { sendMessage } from '../../actions/flash.action';

class AreaUpdate extends React.Component {
    
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
                coords: { value: '', error: '' },
                userId: { value: '', error: '' }
            },
            isLoading: true,
            formValid: false,
            areaGroupNewFormShown: false,
            userOptions: [['Assign User', '']],
            areaGroupOptions: [['Select Group', '']],
            areaList: []
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.toggleProp = this.toggleProp.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchUsers();
        this.props.fetchAreaGroups();
    }

    componentDidUpdate(prevProps) {
        
        const {
            props: {
                success,
                message,
                sendMessage,
                areaGroupSuccess,
                areaGroupMessage,
                clearAreaGroups,
                fetchAreaGroups,
                areaGroups,
                //area passed in by area-index as props
                id,
                areas,
                users,
                areaGroupId
            },
            state: { isLoading, fields }
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
                fields: initializeForm({ ...fields }, areas.find(area => area._id === id)),
                areaGroupOptions,
                areaList
            })
        }
        
        if (this.props.coords !== this.state.fields.coords.value) {
            const { props: { areas, id }, state: { fields }, validationRules } = this;
            const newFields = { ...fields };
            
            newFields.coords.value = this.props.coords;

            this.setState(
                validate(null, validationRules, newFields, areas, areas.find(area => area._id === id))
            );
        }
        
        if (prevProps.groupSelected !== this.props.groupSelected) {
            const fields = { ...this.state.fields };
            
            fields.areaGroupId.value = this.props.groupSelected;
            
            this.setState({ fields });
        }
        
        if (prevProps.areaGroups !== this.props.areaGroups) {
            
            if (areaGroupId) {
                const fields = { ...this.state.fields };
                
                const areaGroupOptions = [
                    ...this.state.areaGroupOptions,
                    [areaGroups.find(areaGroup => areaGroup._id == areaGroupId).title, areaGroupId]
                ];
                
                fields.areaGroupId.value = areaGroupId;
                
                this.setState({ fields, areaGroupOptions });
            }
        }

        if (success) {
            sendMessage(message);
            //use context?
            this.props.clearAreas();
            this.props.fetchAreas();
            this.props.close();
        }
        
        if (areaGroupSuccess) {
            sendMessage(areaGroupMessage);
            clearAreaGroups();
            fetchAreaGroups();
            
            this.setState({ areaGroupNewFormShown: false });
        }
    }
    
    handleUserInput(e) {
        const { state: { fields }, props: { areas }, validationRules } = this;
        
        this.setState(
            validate(e, validationRules, { ...fields }, areas, null)
        );
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const { state: { fields }, props: { updateArea } } = this;
        
        formSubmit({ fields: { ...fields }, action: updateArea, id: this.props.id });
    }
    
    toggleProp(prop) {
        return () => this.setState({ [prop]: !this.state[prop] });
    }

    render() {
        const {
            state: {
                isLoading,
                formValid,
                userOptions,
                areaGroupOptions,
                fields: { title, areaGroupId, userId }
            },
            handleSubmit,
            handleUserInput,
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
                
            <div>
                <h2>Update Area</h2>
                <form onSubmit={ handleSubmit }>
                    <FieldInput
                        name="title"
                        type="text"
                        placeholder="title"
                        value={ title.value }
                        handleUserInput={ handleUserInput }
                        error={ title.error }
                    />
                    <div style={{ display: 'flex' }}>
                        <FieldSelect
                            name="areaGroupId"
                            value={ areaGroupId.value }
                            handleUserInput={ handleUserInput }
                            error={ areaGroupId.error }
                            options={ areaGroupOptions }
                        />
                        <IconLink clickEvent={ this.toggleProp('areaGroupNewFormShown') } type="success" icon="plus" />
                    </div>
                    <FieldSelect
                        name="userId"
                        value={ userId.value }
                        handleUserInput={ handleUserInput }
                        error={ userId.error }
                        options={ userOptions }
                    />

                    <button type="submit" disabled={ !formValid } className="button success">Update Area</button>
                </form>
                <button onClick={ this.props.close } className="button cancel">Cancel</button>
                <Modal
                    close={ this.toggleProp('areaGroupNewFormShown') }
                    shown={ this.state.areaGroupNewFormShown }
                    title="Create Area Group"
                >
                    <AreaGroupNew />
                </Modal>
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
    areaGroupId: state.areaGroups.areaGroupId,
    areaGroups: state.areaGroups.areaGroups
});

export default connect(mapStateToProps, { updateArea, fetchUsers, sendMessage, clearAreaGroups, fetchAreaGroups })(AreaUpdate);