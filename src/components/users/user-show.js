import React from 'react';
import { connect } from 'react-redux';

import { fetchUser } from '../../actions/users.action';

class UserShow extends React.Component {
    
    componentDidMount() {
		if (!this.props.user) this.props.fetchUser(this.props.match.params.id);
		console.log(this.props);
	}
    
    render() {
        
        const { user } = this.props;
        
        return (
            <div className="component-page user-show">
                <h1>User Name</h1>
            </div>
        );
    }
}

const mapStateToProps = state => {
	return { user: state.user };
};

const mapDispatchToProps = dispatch => {
    return { fetchUser };
};


export default connect(mapStateToProps, mapDispatchToProps)(UserShow);