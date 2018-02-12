import React from 'react';
import { connect } from 'react-redux';

import { createUser } from '../../actions/users.action';

class UserCreate extends React.Component {
    
	constructor(props) {
        super(props);
    }
    
    render() {
        
        return (
            <div className="component-page user-create">
                <h1>Create User</h1>
            </div>
        );
    }
}

const mapStateToProps = state => {
	return { message: state.message };
};


export default connect(mapStateToProps, { createUser })(UserCreate);