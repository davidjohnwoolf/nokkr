import React from 'react';
import { connect } from 'react-redux';

import { createUser } from '../../actions/users';

class UserShow extends React.Component {
    
    handleSubmit(e) {
        //validation
        //check if success or error
        //if error display message
        //if success redirect to login and display message
        
        e.preventDefault();
        
        this.props.createUser({
            name: document.querySelector('input[name=name]').value,
            username: document.querySelector('input[name=username]').value,
            email: document.querySelector('input[name=email]').value,
            password: document.querySelector('input[name=password]').value,
            passwordConfirmation: document.querySelector('input[name=passwordConfirmation]').value
        }, () => {
            if (this.props.error) document.querySelector('.error-message').innerHTML = this.props.error;
            if (this.props.message)document.querySelector('.error-message').innerHTML = this.props.message;
        });
    }
    
    render() {
        
        return (
            <div className="component-page user-new form-component">
                <h1>Create User</h1>
                <div className="error-message"></div>
                <form id="user-new-form">
                    <input name="name" placeholder="name" />
                    <input name="username" placeholder="username" />
                    <input name="email" type="email" placeholder="email" />
                    <input name="password" type="password" placeholder="password" />
                    <input name="passwordConfirmation" type="password" placeholder="password confirmation" />
                    <button onClick={ this.handleSubmit.bind(this) }>Submit</button>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    // figure out best way to do this
    if (state.usersReducer.error) {
        return { error: state.usersReducer.error }
    } else if (state.usersReducer.message) {
        return { message: state.usersReducer.message };
    } else {
        return {};
    }
};

export default connect(mapStateToProps, { createUser })(UserShow);