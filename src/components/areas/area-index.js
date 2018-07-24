import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { sortItems } from '../helpers/list';

import Loading from '../layout/loading';
import Modal from '../layout/modal';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';
import MapIndex from './map-index';

import { fetchAreas, clearAreas } from '../../actions/areas.action';
import { clearAreaGroups } from '../../actions/area-groups.action';

class AreaIndex extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearAreas();
        props.clearAreaGroups();
        
        this.state = {
            mapType: 'roadmap',
            isLoading: true,
            areaList: null,
            settingsModalShown: false,
            mapShown: false,
            areaGroups: null,
            areaCount: 0,
            activeShown: true,
            sortSettings: {
                column: undefined,
                ascending: true
            }
        };
        
        this.sortList = this.sortList.bind(this);
        this.renderAreas = this.renderAreas.bind(this);
        this.toggleActive = this.toggleActive.bind(this);
        this.toggleProp = this.toggleProp.bind(this);
        this.toggleMapActive = this.toggleMapActive.bind(this);
        this.setMapType = this.setMapType.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchAreas();
    }
    
    componentDidUpdate(prevProps, prevState) {
        const { props: { areas }, state: { isLoading, areaList, sortSettings, activeShown } } = this;
        
        if (areas && isLoading) {
            const areaGroups = [];
            
            areas.forEach(area => {
                if (!areaGroups.find(areaGroup => areaGroup._id == area.areaGroupId) && area.areaGroup) {
                    areaGroups.push(area.areaGroup);
                }
            });
            
            this.setState({ isLoading: false, areaList: areas, areaGroups, areaCount: areas.length });
        }
        
        //update area list on active toggle
        if (!isLoading && prevState.activeShown !== activeShown) {
            
            console.log(areas)
            
            const filteredList = areas.filter(area => {
                return activeShown ? area.isActive : !area.isActive;
            });
            
            this.setState({ areaList: sortItems(filteredList, sortSettings), areaCount: filteredList.length });
        }
        
        //update area list on sort
        if (!isLoading && prevState.sortSettings !== sortSettings) {
            this.setState({ areaList: sortItems(areaList, sortSettings) });
        }
    }
	
    renderAreas() {
        return (
            this.state.areaList.map(area => {
                return (
			        <tr key={ area._id }>
                        <td>
                            <Link to={ `/areas/${ area._id }` }>{ area.title }</Link>
                        </td>
                        <td>{ area.assignedUserName }</td>
                        <td><Link to={ `/area-groups/${ area.areaGroupId }` }>{ area.areaGroup.title }</Link></td>
                        <td>{ area.teamTitle }</td>
                    </tr>
                );
            })
        );
    }
    
    toggleActive() {
        this.setState({ activeShown: !this.state.activeShown});
    }
    
    toggleMapActive() {
        this.setState({ mapShown: !this.state.mapShown });
    }
    
    sortList(col) {
        const { sortSettings: { column, ascending } } = this.state;
        
        col === column
            ? this.setState({ sortSettings: { column, ascending: !ascending } })
            : this.setState({ sortSettings: { column: col, ascending: true } });
    }
    
    toggleProp(prop) {
        return () => this.setState({ [prop]: !this.state[prop] });
    }
    
    setMapType(type) {
        return () => this.setState({ mapType: type });
    }
    
    render() {
        
        const {
            props: { history },
            state: { sortSettings, isLoading, activeShown, areaCount, settingsModalShown, mapShown, areaGroups, areaList, mapType },
            sortList, renderAreas, toggleActive, toggleProp, toggleMapActive, setMapType
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="area-index" className="content">
                
                <ContentHeader title="Area Management" history={ history } chilrenAccess={ /*!isReadOnly*/ true }>
                    { /*<IconLink url="/areas/new" type="success" icon="plus" /> */ }
                    <IconLink clickEvent={ toggleProp('settingsModalShown') } icon="cog" />
                </ContentHeader>
                <table className={ `table ${ !mapShown ? '' : 'invisible' }` }>
                    <thead>
                        <tr>
                            
                            <th>
                                <div onClick={ () => sortList('title') } className="sort-control">
                                    Title <i className={
                                        sortSettings.column === 'title'
                                            ? (sortSettings.ascending ? 'fas fa-caret-down' : 'fas fa-caret-up')
                                            : 'fas fa-sort'
                                    }></i>
                                </div>
                            </th>
                            <th>
                                <div onClick={ () => sortList('assignedUserName') } className="sort-control">
                                    User <i className={
                                        sortSettings.column === 'assignedUserName'
                                            ? (sortSettings.ascending ? 'fas fa-caret-down' : 'fas fa-caret-up')
                                            : 'fas fa-sort'
                                    }></i>
                                </div>
                            </th>
                            <th>
                                <div onClick={ () => sortList('groupTitle') } className="sort-control">
                                    Group <i className={
                                        sortSettings.column === 'groupTitle'
                                            ? (sortSettings.ascending ? 'fas fa-caret-down' : 'fas fa-caret-up')
                                            : 'fas fa-sort'
                                    }></i>
                                </div>
                            </th>
                            <th>
                                <div onClick={ () => sortList('teamTitle') } className="sort-control">
                                    Team <i className={
                                        sortSettings.column === 'teamTitle'
                                            ? (sortSettings.ascending ? 'fas fa-caret-down' : 'fas fa-caret-up')
                                            : 'fas fa-sort'
                                    }></i>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderAreas() }
                    </tbody>
                </table>
                
                <MapIndex areas={ areaList } mapShown={ mapShown } mapType={ mapType } areaGroups={ areaGroups } activeShown={ activeShown } />
                <p style={{ marginTop: '1rem' }}>Areas Shown: { areaCount }</p>
                
                <Modal close={ toggleProp('settingsModalShown') } shown={ settingsModalShown } title="Area Settings">

                    <section className="area-settings">
                        <div className={ `button-toggle ${ mapShown ? '' : 'invisible' }` }>
                            <button onClick={ setMapType('roadmap') } className={ mapType === 'roadmap' ? 'active' : '' }>Roadmap</button>
                            <button onClick={ setMapType('satellite') } className={ mapType === 'satellite' ? 'active' : '' }>Satellite</button>
                            <button onClick={ setMapType('hybrid') } className={ mapType === 'hybrid' ? 'active' : '' }>Hybrid</button>
                        </div>
                        
                        <div className="button-group">
                            <div className="toggle">
                                <label>Show Inactive Areas</label>
                                <span onClick={ toggleActive }>
                                    <i className={ !activeShown ? 'fas fa-toggle-on' : 'fas fa-toggle-off' }></i>
                                </span>
                            </div>
                            <div className="toggle">
                                <label>Toggle Map View</label>
                                <span onClick={ toggleMapActive }>
                                    <i className={ mapShown ? 'fas fa-toggle-on' : 'fas fa-toggle-off' }></i>
                                </span>
                            </div>
                        </div>
                    </section>
                </Modal>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    areas: state.areas.areas,
    isReadOnly: state.auth.isReadOnly
});


export default connect(mapStateToProps, { fetchAreas, clearAreas, clearAreaGroups })(AreaIndex);