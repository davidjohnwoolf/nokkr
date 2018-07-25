import React from 'react';
import { connect } from 'react-redux';

import { required, unique, validate, formSubmit } from '../helpers/forms';
import { AREA_PATH } from '../../../lib/constants';

import AreaGroupNew from '../area-groups/area-group-new';
import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';
import Loading from '../layout/loading';
import Modal from '../layout/modal';
import IconLink from '../layout/icon-link';

import { createArea } from '../../actions/areas.action';
import { fetchUsers } from '../../actions/users.action';
import { clearAreaGroups, fetchAreaGroups } from '../../actions/area-groups.action';
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
                coords: { value: '', error: '' },
                userId: { value: '', error: '' }
            },
            isLoading: true,
            coords: null,
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
    
    componentDidUpdate(prevProps, prevState) {
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
        
        if (prevProps.coords !== this.props.coords) {
            const fields = { ...this.state.fields };
            
            fields.coords.value = this.props.coords;
            
            this.setState({ fields });
        }
        
        if (prevProps.groupSelected !== this.props.groupSelected) {
            const fields = { ...this.state.fields };
            
            fields.areaGroupId.value = this.props.groupSelected;
            
            this.setState({ fields });
        }

        if (success) {
            sendMessage(message);
            //set new area on map, probably re fetch areas
            //use context?
            this.props.clearAreas();
            this.props.fetchAreas();
            this.props.close();
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
        
        formSubmit({ fields: { ...fields }, action: createArea });
    }
    
    toggleProp(prop) {
        return () => this.setState({ [prop]: !this.state[prop] });
    }

    render() {
        const {
            state: {
                isLoading,
                formValid,
                areaList,
                userOptions,
                areaGroupOptions,
                fields: { title, areaGroupId, userId }
            },
            handleSubmit,
            handleUserInput,
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
                
            <div className={ this.props.shown ? '' : 'invisible' }>
                <h2>Create Area</h2>
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

                    <button type="submit" disabled={ !formValid } className="button success">Save Area</button>
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
    areaGroups: state.areaGroups.areaGroups
});

export default connect(mapStateToProps, { createArea, fetchUsers, sendMessage, clearAreaGroups, fetchAreaGroups })(AreaNew);