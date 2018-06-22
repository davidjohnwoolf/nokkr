import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Map from './map'
import { fetchAreasUser } from '../../actions/areas.action';

class AreasUser extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.fetchAreasUser(props.match.params.id);
        
        this.state = {
            currentArea: ''
        }
        
        this.handleAreaSelect = this.handleAreaSelect.bind(this);
    }
    
    componentDidMount() {
        
    }
	
    renderAreaOptions() {
        const { areas } = this.props;
        
        if (!areas) return;
        
        return (
            areas.map(area => {
                return (
                    <option key={ area._id } value={ area._id }>
    			            { area.title } - { area.city }
			        </option>
                );
            })
        );
    }
    
    handleAreaSelect(e) {
        this.setState({ currentArea: e.target.value });
    }
    
    render() {
        
        if (!this.props.areas) return null;
        
        return <main className="area-show"><Map areas={ this.props.areas } /></main>;
    }
}

const mapStateToProps = state => ({ areas: state.areas.areas });


export default connect(mapStateToProps, { fetchAreasUser })(AreasUser);