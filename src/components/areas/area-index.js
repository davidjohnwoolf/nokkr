import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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
            sortSettings: {
                column: undefined,
                ascending: true
            }
        };
        
        this.sortList = this.sortList.bind(this);
        this.renderAreas = this.renderAreas.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchAreas();
    }
    
    componentDidUpdate(prevProps, prevState) {
        const { props: { areas }, state: { isLoading, areaList, sortSettings } } = this;
        
        if (areas && isLoading) this.setState({ isLoading: false, areaList: areas });
        
        //update area list on sort
        if (!isLoading && prevState.sortSettings !== sortSettings) {
            const sortedList = [...areaList];
            
            sortedList.sort((a, b) => {
                return sortSettings.ascending
                    ? (a[sortSettings.column] > b[sortSettings.column] ? 1 : -1)
                    : (a[sortSettings.column] < b[sortSettings.column]  ? 1 : -1);
            });
            
            this.setState({ areaList: sortedList });
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
    
    sortList(col) {
        const { sortSettings: { column, ascending } } = this.state;
        
        col === column
            ? this.setState({ sortSettings: { column, ascending: !ascending } })
            : this.setState({ sortSettings: { column: col, ascending: true } });
    }
    
    render() {
        
        const { props: { isReadOnly, history }, state: { sortSettings, isLoading }, sortList, renderAreas } = this;
        
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
            </main>
        );
    }
}

const mapStateToProps = state => ({
    areas: state.areas.areas,
    isReadOnly: state.auth.isReadOnly
});


export default connect(mapStateToProps, { fetchAreas })(AreaIndex);