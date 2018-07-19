import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { sortItems } from '../helpers/list';

import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';

import { fetchAreas } from '../../actions/areas.action';

class AreaIndex extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: true,
            areaList: null,
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
    }
    
    componentDidMount() {
        this.props.fetchAreas();
    }
    
    componentDidUpdate(prevProps, prevState) {
        const { props: { areas }, state: { isLoading, areaList, sortSettings, activeShown } } = this;
        
        if (areas && isLoading) this.setState({ isLoading: false, areaList: areas, areaCount: areas.length });
        
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
    
    sortList(col) {
        const { sortSettings: { column, ascending } } = this.state;
        
        col === column
            ? this.setState({ sortSettings: { column, ascending: !ascending } })
            : this.setState({ sortSettings: { column: col, ascending: true } });
    }
    
    render() {
        
        const {
            props: { isReadOnly, history },
            state: { sortSettings, isLoading, activeShown, areaCount },
            sortList, renderAreas, toggleActive
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="area-index" className="content">
                <ContentHeader title="Area Management" history={ history } chilrenAccess={ !isReadOnly }>
                    <IconLink url="/areas/new" type="success" icon="plus" />
                </ContentHeader>
                <table className="table">
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
                <div className="button-group">
                    <div className="toggle">
                        <label>Toggle Inactive</label>
                        <span onClick={ toggleActive }>
                            <i className={ !activeShown ? 'fas fa-toggle-on' : 'fas fa-toggle-off' }></i>
                        </span>
                    </div>
                    <p style={{ marginTop: '1rem' }}>Areas Shown: { areaCount }</p>
                </div>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    areas: state.areas.areas,
    isReadOnly: state.auth.isReadOnly
});


export default connect(mapStateToProps, { fetchAreas })(AreaIndex);