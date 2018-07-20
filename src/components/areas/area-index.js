import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { sortItems } from '../helpers/list';

import Loading from '../layout/loading';
import Modal from '../layout/modal';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';
import MapIndex from './map-index';

import { fetchAreas } from '../../actions/areas.action';

class AreaIndex extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: true,
            areaList: null,
            modalShown: false,
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
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleMapActive = this.toggleMapActive.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchAreas();
    }
    
    componentDidUpdate(prevProps, prevState) {
        const { props: { areas }, state: { isLoading, areaList, sortSettings, activeShown } } = this;
        
        if (areas && isLoading) {
            const areaGroups = [];
            
            areas.forEach(area => {
                if (!areaGroups.find(areaGroup => areaGroup._id == area.groupId)) {
                    areaGroups.push({ _id: area.groupId, title: area.groupTitle });
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
                        <td><Link to={ `/area-groups/${ area.groupId }` }>{ area.groupTitle }</Link></td>
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
    
    toggleModal() {
        this.setState({ modalShown: !this.state.modalShown });
    }
    
    render() {
        
        const {
            props: { history },
            state: { sortSettings, isLoading, activeShown, areaCount, modalShown, mapShown, areaGroups, areaList },
            sortList, renderAreas, toggleActive, toggleModal, toggleMapActive
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="area-index" className="content">
                
                <ContentHeader title="Area Management" history={ history } chilrenAccess={ /*!isReadOnly*/ true }>
                    { /*<IconLink url="/areas/new" type="success" icon="plus" /> */ }
                    <IconLink clickEvent={ toggleModal } icon="cog" />
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
                <p style={{ marginTop: '1rem' }}>Areas Shown: { areaCount }</p>
                <Modal close={ toggleModal } shown={ modalShown } title="Create Area Group">
                    <div style={{ margin: '2rem 0' }}>
                        <Link className="button success" to="/areas/new">New Area <i className="fas fa-plus"></i></Link>
                    </div>
                    <div className="button-group">
                        <div className="toggle">
                            <label>Toggle Inactive</label>
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
                </Modal>
                <MapIndex areas={ areaList } mapShown={ mapShown } areaGroups={ areaGroups } />
            </main>
        );
    }
}

const mapStateToProps = state => ({
    areas: state.areas.areas,
    isReadOnly: state.auth.isReadOnly
});


export default connect(mapStateToProps, { fetchAreas })(AreaIndex);