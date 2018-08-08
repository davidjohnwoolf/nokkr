import React from 'react';
import { connect } from 'react-redux';

import Loading from '../layout/loading';
import MapShow from './map-show';

import { fetchAreas } from '../../actions/areas.action';
import { fetchLeads } from '../../actions/leads.action';

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
        this.props.fetchLeads();
    }
    
    componentDidUpdate() {
        const { props: { areas, leads }, state: { isLoading } } = this;
        
        if (areas && leads && isLoading) {
            //filter out inactive
            const areaList = areas.filter(area => area.isActive);
            
            this.setState({ isLoading: false, areaList });
        }
    }
    
    render() {
        
        const { props: { history, isReadOnly, role, leads,  match: { params } }, state: { isLoading, areaList } } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="area-show" className="map-content">
                <MapShow areas={ areaList } leads={ leads } id={ params.id } history={ history } isReadOnly={ isReadOnly } role={ role } />
            </main>
        );
    }
}

const mapStateToProps = state => ({
    areas: state.areas.areas,
    leads: state.leads.leads,
    isReadOnly: state.auth.isReadOnly,
    role: state.auth.role
});

export default connect(mapStateToProps, { fetchAreas, fetchLeads })(AreaShow);