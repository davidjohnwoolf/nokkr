import React from 'react';
import { connect } from 'react-redux';

import { fetchUser } from '../../actions/users';

class UserShow extends React.Component {
    
    componentDidMount() {
		this.props.fetchUser(this.props.match.params.id);
		console.log(this.props)
	}
    
    render() {
        
        const { user } = this.props;
        
        return (
            <div className="component-page user-show">
                <h1>{ this.props.user }</h1>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
	return { user: state.user };
}

export default connect(mapStateToProps, { fetchUser })(UserShow);