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
        const { error, message, history } = this.props;
        
        if (error) {
            document.querySelector('.user-new .error-message').innerHTML = error;
        }
        
        if (message) {
            //set up flash message
            history.push('/users');
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