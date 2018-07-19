import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';

import { fetchAreaGroup, clearAreaGroups } from '../../actions/area-groups.action';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

class AreaGroupShow extends React.Component {
    
	constructor(props) {
        super(props);
        
        props.clearAreaGroups();
        
        this.state = {
            isLoading: true
        }
    }
    
    componentDidMount() {
        this.props.fetchAreaGroup(this.props.match.params.id);
    }
    
    componentDidUpdate() {
        const { props: { areaGroup }, state: { isLoading } } = this;
        
        if (areaGroup && isLoading) this.setState({ isLoading: false });
    }
    
    renderAreas() {
        const { areaGroup } = this.props;
        console.log(areaGroup.areas);
        
        return (
            <div className="areas-list">
                <h3>Areas</h3>
                <ul className="link-list">
                    { areaGroup.areas.map(area => {
                        if (area.isActive) {
                            return (
                                <li key={ area._id }>
                                    <Link to={ `/areas/${ area._id }` } className="with-icon">
                                        <span>{ area.title } ({ area.assignedUserName })</span>
                                        <i className="fas fa-chevron-right"></i>
                                    </Link>
                                </li>
                            );
                        } else { return null }
                    }) }
                </ul>
            </div>
        );
    }
    
    render() {
        
        const {
            props: { history, areaGroup, match: { params }, isReadOnly },
            state: { isLoading }
        } = this;
        
        if (isLoading) return <Loading />;
        
        //figure out area group teams
        
        return (
            <main id="areaGroup-show" className="content">
                
                <ContentHeader title={ areaGroup.title } history={ history } chilrenAccess={ !isReadOnly }>
                    <IconLink url={ `/area-groups/${ params.id }/edit` } icon="edit" />
                </ContentHeader>
                
                <section className="card">
                    <section>
                        <h4>Title</h4>
                        <p>{ areaGroup.title }</p>

                        <h4>Color</h4>
                        <div style={{ height: '2rem', width: '4rem', background: areaGroup.color }}></div>
                    </section>
                </section>

                { this.renderAreas() }

            </main>
        );
    }
}

const mapStateToProps = state => ({
    areaGroup: state.areaGroups.areaGroup,
    isReadOnly: state.auth.isReadOnly
});

export default connect(mapStateToProps, { fetchAreaGroup, clearAreaGroups })(AreaGroupShow);