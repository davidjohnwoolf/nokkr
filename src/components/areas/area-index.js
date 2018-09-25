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
            isLoading: true,
            areaList: null,
            areaGroups: null,
            areaCount: 0,
            tableShown: false,
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
            
            const filteredList = areas.filter(area => {
                return activeShown ? area.isActive : !area.isActive;
            });
            
            this.setState({ areaList: sortItems(filteredList, sortSettings), areaCount: filteredList.length });
        }
        
        //update area list on sort
        if (!isLoading && prevState.sortSettings !== sortSettings) {
            this.setState({ areaList: sortItems(areaList, sortSettings) });
        }
        
        //if new area created
        if (!isLoading && prevProps.areas !== areas) {
            
            const filteredList = areas.filter(area => {
                return activeShown ? area.isActive : !area.isActive;
            });
            
            this.setState({ areaList: sortItems(filteredList, sortSettings) });
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
    
    sortList(col) {
        const { sortSettings: { column, ascending } } = this.state;
        
        col === column
            ? this.setState({ sortSettings: { column, ascending: !ascending } })
            : this.setState({ sortSettings: { column: col, ascending: true } });
    }
    
    toggleProp(prop) {
        return () => this.setState({ [prop]: !this.state[prop] });
    }
    
    render() {
        
        const {
            props: { history, fetchAreas, clearAreas },
            state: { sortSettings, isLoading, activeShown, areaCount, areaGroups, areaList, tableShown },
            sortList, renderAreas, toggleActive, toggleProp
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="area-index" className="map-content">
                <div style={{ margin: '1rem' }}>
                    <ContentHeader title="Area Management" history={ history } />
                    <div className="button-group">
                        <button onClick={ toggleProp('tableShown') }>Show List</button>
                        <div className="toggle">
                            <label>Show Inactive Areas</label>
                            <span onClick={ toggleActive }>
                                <i className={ !activeShown ? 'fas fa-toggle-on' : 'fas fa-toggle-off' }></i>
                            </span>
                        </div>
                        <div className="toggle">
                            <label>Show Leads</label>
                            <span>
                                <i className="fas fa-toggle-off"></i>
                            </span>
                        </div>
                    </div>
                </div>
                
                <MapIndex
                    areas={ areaList }
                    areaGroups={ areaGroups }
                    fetchAreas={ fetchAreas }
                    clearAreas={ clearAreas }
                    activeShown={ activeShown }
                />
                
                <Modal close={ toggleProp('tableShown') } shown={ tableShown } title="Area List">
                    <table className={ tableShown ? 'table' : 'invisible' }>
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
                    <p style={{ marginTop: '1rem' }}>Areas Shown: { areaCount }</p>
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