import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import DrawMap from './draw-map';
import { required, validate } from '../helpers/validation';
import FieldInput from '../helpers/field-input';
import FieldSelect from '../helpers/field-select';
import { createArea, clearArea } from '../../actions/areas.action';
import { fetchUsers } from '../../actions/users.action';
import { sendMessage } from '../../actions/flash.action';

class AreaNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearArea();
        
        props.fetchUsers();
        
        this.validationRules = {
            title: [required],
            city: [required],
            userId: [required]
        };
        
        this.state = {
            fields: {
                title: { value: '', error: '' },
                userId: { value: '', error: '' },
                city: { value: '', error: '' }
            },
            coords: null,
            formValid: false,
        };

        this.handleOverlay = this.handleOverlay.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidUpdate() {
        const { success, fail, message, history, sendMessage } = this.props;
        
        if (fail && (message !== this.state.serverError)) this.setState({ serverError: message });
        
        if (success) {
            sendMessage(message);
            history.push('/areas');
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

    render() {
        
        const { handleSubmit, handleUserInput, handleOverlay } = this;
        const { formValid, serverError, coords } = this.state;
        const { title, city, userId } = this.state.fields;
        const { users } = this.props;
        const userSelectOptions = [['Assign User', '']];
        let areas = [];
        
        if (!users) return null;
        
        users.forEach(user => {
            let userOption = [user.name, user.id];
            
            userSelectOptions.push(userOption);
            
            
            areas = areas.concat(user.areas);
        });
        
        
        return (
                
            <main id="area-new" className="content">
                <section className="form">
                    <h1>Create Area</h1>
                    
                    <DrawMap handleOverlay={ handleOverlay } areas={ areas } />
                    
                    <h2>Save Area</h2>
                    <small className="server-error">{ serverError }</small>
                    <form onSubmit={ handleSubmit }>
                        <FieldInput
                            name="title"
                            type="text"
                            placeholder="area title"
                            value={ title.value }
                            handleUserInput={ handleUserInput }
                            error={ title.error }
                        />
                        <FieldInput
                            name="city"
                            type="text"
                            placeholder="enter city name"
                            value={ city.value }
                            handleUserInput={ handleUserInput }
                            error={ city.error }
                        />
                        <FieldSelect
                            name="userId"
                            value={ userId.value }
                            handleUserInput={ handleUserInput }
                            error={ userId.error }
                            options={ userSelectOptions }
                        />
                        
                        <input type="hidden" name="coords" value={ coords || '' } />
                        
                        <div className="btn-group">
                            <button
                                disabled={ !formValid || !coords }
                                className="btn btn-primary"
                                type="submit">
                                Save Area
                            </button>
                            <Link className="btn btn-cancel" to="/areas">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </section>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    message: state.areas.message,
    success: state.areas.success,
    fail: state.areas.fail,
    users: state.users.users
});

export default connect(mapStateToProps, { createArea, fetchUsers, clearArea, sendMessage })(AreaNew);