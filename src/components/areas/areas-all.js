import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchAreasAll } from '../../actions/areas.action';

class AreasAll extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.fetchAreasAll();
    }
	
    renderAreas() {
        const { areas } = this.props;
        
        if (!areas) return;
        
        return (
            areas.map(area => {
                return (
                    <li key={ area._id }>
                        <Link to={ `/users/${ area.userData.id }/areas/${ area._id }` } className="icon-link">
    			            { area.title } - { area.userData.name }
    			            
    			            <i className="fas fa-chevron-right"></i>
    			        </Link>
			        </li>
                );
            })
        );
    }
    
    render() {
        
        return (
            <main id="areas-all" className="content">
                <section className="index">
                    <header className="content-header">
                        <h1>All Areas</h1>
                        <Link className="icon-button-success" to="/areas/new"><i className="fas fa-plus"></i></Link>
                    </header>
                    <ul className="link-list">
                        { this.renderAreas() }
                    </ul>
                </section>
            </main>
        );
    }
}

const mapStateToProps = state => ({ areas: state.areas.allAreas });


export default connect(mapStateToProps, { fetchAreasAll })(AreasAll);