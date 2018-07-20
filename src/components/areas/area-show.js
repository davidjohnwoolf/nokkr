import React from 'react';
import { connect } from 'react-redux';

import Loading from '../layout/loading';
import Map from './map';

import { fetchAreas } from '../../actions/areas.action';

class AreaShow extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: true,
            areaList: null
        };
    }
    
    componentDidMount() {
        this.props.fetchAreas();
    }
    
    componentDidUpdate() {
        const { props: { areas }, state: { isLoading } } = this;
        
        //filter out inactive
        const areaList = areas.filter(area => area.isActive);
        
        if (areas && isLoading) this.setState({ isLoading: false, areaList });
    }
    
    render() {
        
        const { props: { history, isReadOnly, role, match: { params } }, state: { isLoading, areaList } } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="area-show" className="map-content">
                <Map areas={ areaList } id={ params.id } history={ history } isReadOnly={ isReadOnly } role={ role } />
            </main>
        );
    }
}

const mapStateToProps = state => ({
    areas: state.areas.areas,
    isReadOnly: state.auth.isReadOnly,
    role: state.auth.role
});

export default connect(mapStateToProps, { fetchAreas })(AreaShow);