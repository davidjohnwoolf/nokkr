import React from 'react';
import { connect } from 'react-redux';

import { createUser } from '../../actions/users';

class UserShow extends React.Component {
    
    constructor(props) {
        super(props);
        
         this.handleSubmit = this.handleSubmit.bind(this)
    }
    
    // componentWillRecieveProps?
    componentDidUpdate() {
        if (this.props.error) {
            document.querySelector('.user-new .error-message').innerHTML = this.props.error;
        }
        
        if (this.props.message) {
             //document.querySelector('body > .message').innerHTML = this.props.message;
             
            //set up flash message
            this.props.history.push('/users');
        }
    }
    
    handleSubmit(e) {
        //set validation
        
        e.preventDefault();
        
        this.props.createUser({
            name: document.querySelector('input[name=name]').value,
            username: document.querySelector('input[name=username]').value,
            email: document.querySelector('input[name=email]').value,
            password: document.querySelector('input[name=password]').value,
            passwordConfirmation: document.querySelector('input[name=passwordConfirmation]').value
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
                    <button onClick={ this.handleSubmit }>Submit</button>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { error: state.usersReducer.error, message: state.usersReducer.message }
};

export default connect(mapStateToProps, { createUser })(UserShow);