import React from 'react';
import { connect } from 'react-redux';

import Loading from '../layout/loading';
import Map from './map';

import { fetchAreas } from '../../actions/areas.action';

class AreaShow extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: true
        };
    }
    
    componentDidMount() {
        this.props.fetchAreas();
    }
    
    componentDidUpdate() {
        const { props: { areas }, state: { isLoading } } = this;
        
        if (areas && isLoading) this.setState({ isLoading: false });
    }
    
    render() {
        
        const { props: { areas, history, match: { params } }, state: { isLoading } } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="area-show" className="content">
                <Map areas={ areas } id={ params.id } history={ history } />
            </main>
        );
    }
}

const mapStateToProps = state => ({
    areas: state.areas.areas,
    //isReadOnly: state.auth.isReadOnly
});


export default connect(mapStateToProps, { fetchAreas })(AreaShow);