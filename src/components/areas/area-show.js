import React from 'react';
import { connect } from 'react-redux';

import Loading from '../layout/loading';
import MapShow from './map-show';

import { fetchAreas } from '../../actions/areas.action';
import { fetchLeads } from '../../actions/leads.action';
import { fetchLeadFields } from '../../actions/lead-fields.action';
import { fetchLeadStatuses } from '../../actions/lead-statuses.action';

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
        this.props.fetchLeadStatuses();
        this.props.fetchLeadFields();
    }
    
    componentDidUpdate() {
        const { props: { areas, leads, leadStatuses }, state: { isLoading } } = this;
        
        if (areas && leads && leadStatuses && isLoading) {
            //filter out inactive
            const areaList = areas.filter(area => area.isActive);
            
            this.setState({ isLoading: false, areaList });
        }
    }
    
    render() {
        
        const { props: { history, isReadOnly, role, leads, leadStatuses, match: { params } }, state: { isLoading, areaList } } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="area-show" className="map-content">
                <MapShow areas={ areaList } leads={ leads } leadStatuses={ leadStatuses } id={ params.id } history={ history } isReadOnly={ isReadOnly } role={ role } />
            </main>
        );
    }
}

const mapStateToProps = state => ({
    areas: state.areas.areas,
    leads: state.leads.leads,
    isReadOnly: state.auth.isReadOnly,
    leadStatuses: state.leadStatuses.leadStatuses,
    role: state.auth.role
});

export default connect(mapStateToProps, { fetchAreas, fetchLeads, fetchLeadStatuses, fetchLeadFields })(AreaShow);