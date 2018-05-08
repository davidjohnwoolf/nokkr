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
        this.props.createUser({ name: 'David' });
        
        console.log(this.props.error, this.props.message);
    }
    
    render() {
        
        return (
            <div className="component-page user-new form-component">
                <h1>Create User</h1>
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

const mapStateToProps = state => ({ message: state.usersReducer.message, error: state.usersReducer.error });

export default connect(mapStateToProps, { createUser })(UserShow);