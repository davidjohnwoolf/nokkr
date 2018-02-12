import React from 'react';
import { connect } from 'react-redux';

import { fetchUser } from '../../actions/users.action';

class UserShow extends React.Component {
    
    componentDidMount() {
		if (!this.props.user) this.props.fetchUser(this.props.match.params.id);
	}
    
    render() {
        
        const { user } = this.props;
        
        console.log(this.props);
        
        return (
            <div className="component-page user-show">
                <h1>{ user ? user.name : '' }</h1>
                <h4>{ user ? user.username : '' }</h4>
                <address>{ user ? user.email : '' }</address>
            </div>
        );
    }
}

const mapStateToProps = state => {
	return { user: state.user };
};


export default connect(mapStateToProps, { fetchUser })(UserShow);