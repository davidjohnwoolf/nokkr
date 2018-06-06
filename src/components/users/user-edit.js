import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { required, password, passwordMatch, validate } from '../helpers/validation';
import FieldInput from '../helpers/field-input';
import { fetchUser, updateUser, clearUser } from '../../actions/users.action';
import { sendMessage } from '../../actions/flash.action';

class UserEdit extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearUser();
        props.fetchUser(props.match.params.id);
        
        this.validationRules = {
            name: [required],
            username: [required],
            email: [required],
            password: [password],
            passwordConfirmation: [passwordMatch]
        };

        this.state = {
            fields: {
                name: { value: '', error: '' },
                username: { value: '', error: '' },
                email: { value: '', error: '' },
                password: { value: '', error: '' },
                passwordConfirmation: { value: '', error: '' }
            },
            serverError: '',
            formValid: false,
            hasInitialized: false
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        const { user } = nextProps;
        const { hasInitialized } = prevState;
        
        if (!hasInitialized && user) {
            const fields = { ...prevState.fields };

            fields.name.value = user.name;
            fields.username.value = user.username;
            fields.email.value = user.email;
            
            return { fields, hasInitialized: true };
            
        } else {
            return prevState;
        }
    }

    
    componentDidUpdate() {
        const { success, fail, message, history, sendMessage, match } = this.props;
        
        if (fail && (message !== this.state.serverError)) this.setState({ serverError: message });
        
        if (success) {
            sendMessage(message);
            history.push(`/users/${ match.params.id }`);
        }
    }
    
    handleUserInput(e) {
        
        this.setState(
            validate(e, this.validationRules, { ...this.state.fields })
        );
    }
    
    handleSubmit(e) {
        
        e.preventDefault();
        
        const userData = { ...this.state.fields };
        
        for (let key in userData) {
            if (userData[key].value) {
                userData[key] = userData[key].value;
            } else {
                delete userData[key];
            }
        }
        
        this.props.updateUser(this.props.match.params.id, { ...userData });
    }
    
    render() {
        const { handleSubmit, handleUserInput } = this;
        const { name, username, email, password, passwordConfirmation } = this.state.fields;
        
        return (
                
            <main id="user-edit" className="content">
                <section className="form">
                    <h1>Edit User</h1>
                    <small className="server-error">{ this.state.serverError }</small>
                    <form onSubmit={ handleSubmit }>
                    
                        <FieldInput
                            name="name"
                            type="text"
                            placeholder="name"
                            value={ name.value }
                            handleUserInput={ handleUserInput }
                            error={ name.error }
                        />
                        <FieldInput
                            name="username"
                            type="text"
                            placeholder="username"
                            value={ username.value }
                            handleUserInput={ handleUserInput }
                            error={ username.error }
                        />
                        <FieldInput
                            name="email"
                            type="email"
                            placeholder="email"
                            value={ email.value }
                            handleUserInput={ handleUserInput }
                            error={ email.error }
                        />
                        <FieldInput
                            name="password"
                            type="password"
                            placeholder="password"
                            value={ password.value }
                            handleUserInput={ handleUserInput }
                            error={ password.error }
                            message="If staying the same, leave password fields blank"
                        />
                        <FieldInput
                            name="passwordConfirmation"
                            type="password"
                            placeholder="password confirmation"
                            value={ passwordConfirmation.value }
                            handleUserInput={ handleUserInput }
                            error={ passwordConfirmation.error }
                        />
                        <div className="btn-group">
                            <button
                                disabled={ !this.state.formValid }
                                className="btn btn-primary"
                                type="submit">
                                Submit
                            </button>
                            <Link className="btn btn-cancel" to={ `/users/${ this.props.match.params.id }` }>
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
    message: state.users.message,
    success: state.users.success,
    fail: state.users.fail,
    user: state.users.user
});

export default connect(mapStateToProps, { fetchUser, clearUser, updateUser, sendMessage })(UserEdit);