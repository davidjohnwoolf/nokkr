import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { required, validate } from '../helpers/forms';

import DrawMap from './draw-map';
import FieldInput from '../forms/field-input';
import FieldSelect from '../forms/field-select';
import Modal from '../layout/modal';
import AreaGroupNew from '../area-groups/area-group-new';

import { createArea, clearArea } from '../../actions/areas.action';
import { fetchUsers } from '../../actions/users.action';
import { fetchAreaGroups, clearAreaGroup } from '../../actions/area-groups.action';
import { sendMessage } from '../../actions/flash.action';

class AreaNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearArea();
        props.clearAreaGroup();
        
        props.fetchUsers();
        props.fetchAreaGroups();
        
        this.validationRules = {
            title: [required],
            areaGroup: [required],
            userId: [required]
        };
        
        this.state = {
            fields: {
                title: { value: '', error: '' },
                areaGroup: { value: '', error: '' },
                userId: { value: '', error: '' }
            },
            coords: null,
            formValid: false,
            modalShown: false
        };

        this.handleOverlay = this.handleOverlay.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }
    
    componentDidUpdate() {
        const { success, message, history, sendMessage, areaGroupSuccess, areaGroupMessage, areaId } = this.props;

        if (success) {
            sendMessage(message);
            history.push(`/areas/${ areaId }`);
        }
        
        if (areaGroupSuccess) {
            sendMessage(areaGroupMessage);
            this.props.clearAreaGroup();
            this.props.fetchAreaGroups();
            this.toggleModal();
        }
    }
    
    handleOverlay(coords) {
        this.setState({ coords });
    }
    
    handleUserInput(e) {
        this.setState(
            validate(e, this.validationRules, { ...this.state.fields })
        );
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const areaData = { ...this.state.fields };
        
        for (let key in areaData) { areaData[key] = areaData[key].value; }
        
        areaData.coords = this.state.coords;
        
        this.props.createArea(areaData);
    }
    
    toggleModal() {
        this.setState({ modalShown: !this.state.modalShown });
    }

    render() {
        
        const { handleSubmit, handleUserInput, handleOverlay, toggleModal, state, props } = this;
        const { formValid, serverError, coords, modalShown } = state;
        const { title, areaGroup, userId } = state.fields;
        const { users, areaGroups, history } = props;
        
        const userOptions = [['Assign User', '']];
        const areaGroupOptions = [['Select Group', '']];
        let areas = [];
        
        if (!users || !areaGroups) return <section className="spinner"><i className="fas fa-spinner fa-spin"></i></section>;
        
        users.forEach(user => {
            userOptions.push([`${user.firstName} ${user.lastName}` , user._id]);
            
            //create area array to display on map
            areas = areas.concat(user.areas);
        });
        areaGroups.forEach(areaGroup => {
            areaGroupOptions.push([areaGroup.title, areaGroup._id]);
        });
        
        
        return (
                
            <main id="area-new" className="content">
                <section className="form">
                    <header className="content-header">
                        <a onClick={ history.goBack } style={{ cursor: 'pointer' }} className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
                        <h1>Create Area</h1>
                    </header>
                    
                    <DrawMap handleOverlay={ handleOverlay } areas={ areas } />
                    
                    <h2>Save Area</h2>
                    <small className="server-error">{ serverError }</small>
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
                            <a onClick={ toggleModal } className="icon-button-success" style={{ cursor: 'pointer' }}><i className="fas fa-plus"></i></a>
                        </div>
                        <FieldSelect
                            name="userId"
                            value={ userId.value }
                            handleUserInput={ handleUserInput }
                            error={ userId.error }
                            options={ userOptions }
                        />
                        
                        <input type="hidden" name="coords" value={ coords || '' } />
                        
                        <div className="btn-group">
                            <button
                                disabled={ !formValid || !coords }
                                className="btn btn-primary"
                                type="submit">
                                Save Area
                            </button>
                            <a onClick={ history.goBack } style={{ cursor: 'pointer' }} className="btn btn-cancel">Cancel</a>
                        </div>
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
    users: state.users.users,
    areaGroupSuccess: state.areaGroups.success,
    areaGroupMessage: state.areaGroups.message,
    areaGroups: state.areaGroups.areaGroups
});

export default connect(mapStateToProps, { createArea, fetchUsers, clearArea, sendMessage, fetchAreaGroups, clearAreaGroup })(AreaNew);