import React from 'react';
import { connect } from 'react-redux';

import { required, unique, validate, formSubmit } from '../helpers/forms';
import { AREA_PATH } from '../../../lib/constants';

import AreaGroupNew from '../area-groups/area-group-new';
import DrawMap from './draw-map';
import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';
import SubmitBlock from '../forms/submit-block';
import Modal from '../layout/modal';
import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';

import { createArea, clearAreas } from '../../actions/areas.action';
import { fetchUsers } from '../../actions/users.action';
import { fetchAreaGroups, clearAreaGroups } from '../../actions/area-groups.action';
import { sendMessage } from '../../actions/flash.action';

class AreaNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearAreas();
        props.clearAreaGroups();
        
        this.validationRules = {
            title: [required, unique],
            areaGroup: [required],
            coords: [required],
            userId: [required]
        };
        
        this.state = {
            fields: {
                title: { value: '', error: '' },
                areaGroup: { value: '', error: '' },
                coords: { value: '', error: '' },
                userId: { value: '', error: '' }
            },
            isLoading: true,
            coords: null,
            formValid: false,
            modalShown: false,
            userOptions: [['Assign User', '']],
            areaGroupOptions: [['Select Group', '']],
            areaList: []
        };

        this.handleOverlay = this.handleOverlay.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
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
            state: { isLoading },
            toggleModal
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
            toggleModal();
        }
    }
    
    handleOverlay(coords) {
        const fields = { ...this.state.fields };
        
        fields.coords.value = coords;
        
        this.setState({ fields });
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
    
    toggleModal() {
        this.setState({ modalShown: !this.state.modalShown });
    }

    render() {
        const {
            props: { history, areaGroups },
            state: {
                isLoading,
                formValid,
                modalShown,
                areaList,
                userOptions,
                areaGroupOptions,
                fields: { title, areaGroup, userId, coords }
            },
            handleSubmit,
            handleUserInput,
            handleOverlay,
            toggleModal
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
                
            <main id="area-new" className="content">
                <section className="form">
                    <ContentHeader title="Create Area" history={ history } />
                    
                    <DrawMap handleOverlay={ handleOverlay } areas={ areaList } areaGroups={ areaGroups } />
                    
                    <h2>Save Area</h2>
                    <form onSubmit={ handleSubmit }>
                        <FieldInput
                            name="title"
                            type="text"
                            placeholder="title"
                            value={ title.value }
                            handleUserInput={ handleUserInput }
                            error={ title.error }
                        />
                        <div className="field-with-icon">
                            <FieldSelect
                                name="areaGroup"
                                value={ areaGroup.id }
                                handleUserInput={ handleUserInput }
                                error={ areaGroup.error }
                                options={ areaGroupOptions }
                            />
                            <IconLink clickEvent={ toggleModal } type="success" icon="plus" />
                        </div>
                        <FieldSelect
                            name="userId"
                            value={ userId.value }
                            handleUserInput={ handleUserInput }
                            error={ userId.error }
                            options={ userOptions }
                        />
                        
                        <input type="hidden" name="coords" value={ coords || '' } />

                        <SubmitBlock submitText="Save Area" history={ history } formValid={ formValid && coords.value } />
                    </form>
                    <Modal close={ toggleModal } shown={ modalShown } title="Create Area Group">
                        <AreaGroupNew />
                    </Modal>
                </section>
            </main>
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

export default connect(mapStateToProps, { createArea, fetchUsers, clearAreas, sendMessage, fetchAreaGroups, clearAreaGroups })(AreaNew);