import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { SU, ADMIN, MANAGER, USER, LEAD_PATH } from '../../../lib/constants';
import { sortItems, searchItems } from '../helpers/list';

import { fetchLeads } from '../../actions/leads.action';

import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';

class LeadsIndex extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: true,
            activeShown: true,
            itemList: [],
            leadsCount: 0,
            filtersShown: false,
            filterSettings: {
                areaId: undefined,
                areaGroupId: undefined,
                city: undefined,
                leadStatusId: undefined,
                userId: undefined,
                teamId: undefined
            },
            leadStatusFilterOptions: null,
            cityFilterOptions: null,
            teamFilterOptions: null,
            areaFilterOptions: null,
            areaGroupFilterOptions: null,
            searchResults: null,
            searchQuery: '',
            sortSettings: {
                column: undefined,
                ascending: true
            }
        };
        
        this.toggleActive = this.toggleActive.bind(this);
        this.sortList = this.sortList.bind(this);
        this.renderLeads = this.renderLeads.bind(this);
        this.filterList = this.filterList.bind(this);
        this.toggleFilters = this.toggleFilters.bind(this);
        this.handleSearchInput = this.handleSearchInput.bind(this);
        this.submitQuery = this.submitQuery.bind(this);
        this.clearResults = this.clearResults.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchLeads();
    }
    
    componentDidUpdate(prevProps, prevState) {
        const {
            props: { leads },
            state: {
                isLoading,
                activeShown,
                itemList, 
                sortSettings
            }
        } = this;
        
        //initialize
        if (leads && isLoading) {
            
            const dupes = {
                leadStatusId: [],
                city: [],
                userId: [],
                teamId: [],
                areaId: [],
                areaGroupId: [],
            };
            
            const leadStatusFilterOptions = [['Filter by Status', '']];
            const cityFilterOptions = [['Filter by City', '']];
            const userFilterOptions = [['Filter by User', '']];
            const teamFilterOptions = [['Filter by Team', '']];
            const areaFilterOptions = [['Filter by Area', '']];
            const areaGroupFilterOptions = [['Filter by Area Group', '']];
            
            
            const buildOptionsFromList = (lead, options, alias, property) => {
                if (lead[property]) {
                    if (!dupes[property].includes(lead[property])) {
                        dupes[property].push(lead[property]);
                        options.push([lead[alias], lead[property]]);
                    }
                }
            };

            leads.forEach(lead => {
                
                buildOptionsFromList(lead, leadStatusFilterOptions, 'leadStatusTitle', 'leadStatusId');
                buildOptionsFromList(lead, cityFilterOptions, 'city', 'city');
                buildOptionsFromList(lead, userFilterOptions, 'assignedUserName', 'userId');
                buildOptionsFromList(lead, teamFilterOptions, 'teamTitle', 'teamId');
                buildOptionsFromList(lead, areaFilterOptions, 'areaTitle', 'areaId');
                buildOptionsFromList(lead, areaGroupFilterOptions, 'areaGroupTitle', 'areaGroupId');

            });
            
            const filteredList = leads.filter(lead => {
                return lead.leadStatusType !== 'No Sale';
            });
            
            this.setState({
                isLoading: false,
                leadsCount: leads.length,
                itemList: filteredList,
                leadStatusFilterOptions,
                cityFilterOptions,
                userFilterOptions,
                teamFilterOptions,
                areaFilterOptions,
                areaGroupFilterOptions
            });
        }
        
        //update user list on active user toggle
        if (!isLoading && prevState.activeShown !== activeShown) {
            const filterSettings = { ...this.state.filterSettings };
            
            const filteredList = this.props.leads.filter(lead => {
                let notFiltered = true;
                
                for (let setting in filterSettings) {
                    if (filterSettings[setting]) {
                        if (lead[setting] !== filterSettings[setting]) {
                            notFiltered = false;
                        }
                    }
                }
                
                if (this.state.activeShown) return (lead.leadStatusType !== 'No Sale') && notFiltered;
                if (!this.state.activeShown) return (lead.leadStatusType === 'No Sale') && notFiltered;
            });
            
            this.setState({ itemList: sortItems(filteredList, sortSettings), leadsCount: filteredList.length });
        }
        
        //update user list on sort
        if (!isLoading && prevState.sortSettings !== sortSettings) {
            this.setState({ itemList: sortItems(itemList, sortSettings) });
        }
    }
    
    toggleActive() {
        this.setState({ activeShown: !this.state.activeShown});
    }
    
    toggleFilters() {
        this.setState({ filtersShown: !this.state.filtersShown});
    }
    
    filterList(prop, value) {
        const filterSettings = { ...this.state.filterSettings };
        let activeShown = this.state.activeShown;
        
        filterSettings[prop] = value;
        
        const filteredList = this.props.leads.filter(lead => {
            let notFiltered = true;
            
            for (let setting in filterSettings) {
                if (filterSettings[setting]) {
                    if (lead[setting] !== filterSettings[setting]) {
                        notFiltered = false;
                    } else {
                        if (setting === 'leadStatusId') {
                            if (lead.leadStatusType === 'No Sale') activeShown = false;
                            if (lead.leadStatusType !== 'No Sale') activeShown = true;
                        }
                    }
                }
            }
            
            if (activeShown) return (lead.leadStatusType !== 'No Sale') && notFiltered;
            if (!activeShown) return (lead.leadStatusType === 'No Sale') && notFiltered;
        });
        
        this.setState({ itemList: sortItems(filteredList, this.state.sortSettings), filterSettings, activeShown });
    }
    
    sortList(col) {
        const { sortSettings: { column, ascending } } = this.state;
        
        col === column
            ? this.setState({ sortSettings: { column, ascending: !ascending } })
            : this.setState({ sortSettings: { column: col, ascending: true } });
    }
    
    handleSearchInput(value) {
        this.setState({ searchQuery: value });
    }
    
    submitQuery(e) {
        e.preventDefault();
        
        this.setState({ searchResults: searchItems(this.props.leads, this.state.searchQuery) });
    }
    
    clearResults() {
        this.setState({ searchResults: null, searchQuery: '' });
    }
	
    renderLeads() {
        const { itemList } = this.state;
        
        return (
            itemList.map(lead => {

                return (
                    <tr key={ lead._id }>
                        <td>
                            <Link to={ LEAD_PATH + lead._id }>{ `${ lead.firstName } ${ lead.lastName }` }</Link>
                        </td>
                        <td>
                            { `${ lead.address } ${ lead.city }, ${ lead.state }` }
                        </td>
                        <td>
                            { lead.leadStatusTitle }
                        </td>
                        <td>
                            { lead.assignedUserName }
                        </td>
                    </tr>
                );
            })
        );
    }
    
    render() {
        const {
            props: { isReadOnly, history },
            state: {
                isLoading,
                activeShown,
                leadsCount,
                sortSettings,
                leadStatusFilterOptions,
                filterSettings,
                filtersShown,
                cityFilterOptions,
                userFilterOptions,
                teamFilterOptions,
                areaFilterOptions,
                areaGroupFilterOptions,
                searchQuery,
                searchResults
            },
            toggleActive, renderLeads, sortList, filterList, toggleFilters, handleSearchInput, submitQuery, clearResults
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="user-index" className="content">
                <ContentHeader title="Lead Management" history={ history } chilrenAccess={ !isReadOnly }>
                    <IconLink onClick={ () => console.log('search') } type="primary" icon="cog" />
                </ContentHeader>
                <form onSubmit={ submitQuery } style={{ display: 'flex' }}>
                    <input type="text" placeholder="search leads" style={{ height: '3.9rem', marginTop: '1rem' }} name="searchQuery" value={ searchQuery } onChange={ (e) => handleSearchInput(e.target.value) } />
                    <button className="button primary" type="submit"><i className="fas fa-search"></i></button>
                </form>
                {
                    searchResults
                        ? (
                            searchResults.length
                                ? (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <h3>Results</h3>
                                            <a className="icon-link cancel" onClick={ clearResults }>
                                                <i className="fas fa-times"></i>
                                            </a>
                                        </div>
                                        <ul style={{ listStyleType: 'none', padding: '0', paddingLeft: '0' }}>
                                            {
                                                searchResults.map(result => {
                                                    return (
                                                    <li key={ result._id } style={{ margin: '1rem 0' }}>
                                                        <Link to={  LEAD_PATH + result._id } style={{ display: 'flex', justifyContent: 'space-between', border: '.1rem solid #ccc' }}>
                                                            <span style={{ padding: '.5rem', borderRight: '.1rem solid #ccc' }}>{ `${ result.firstName } ${ result.lastName }` }</span>
                                                            <span style={{ padding: '.5rem', borderRight: '.1rem solid #ccc' }}>{ result.address }</span>
                                                            <span style={{ padding: '.5rem', borderRight: '.1rem solid #ccc' }}>{ result.leadStatusTitle }</span>
                                                            <span style={{ padding: '.5rem' }}>{ result.assignedUserName }</span>
                                                        </Link>
                                                    </li>
                                                    );
                                                })
                                            }
                                        </ul>
                                    </div>
                                ) : <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h3>No Results Found</h3>
                                        <a className="icon-link cancel" onClick={ clearResults }>
                                            <i className="fas fa-times"></i>
                                        </a>
                                    </div>
                        ) : ''
                }
                <a style={{ display: 'inline-block', margin: '1rem 0', cursor: 'pointer' }} onClick={ toggleFilters }>
                    Show Filters <i className={ filtersShown ? 'fas fa-caret-up' : 'fas fa-caret-down' }></i>
                </a>
                <div className={ filtersShown ? 'list-filters' : 'invisible' }>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <select style={{ marginRight: '1rem' }} value={ filterSettings.areaId } onChange={ e => filterList('areaId', e.target.value) }>
                            {
                                areaFilterOptions.map(option => {
                                    return <option key={ option[1] } value={ option[1] }>{ option[0] }</option>;
                                })
                            }
                        </select>
                        <select value={ filterSettings.areaGroupId } onChange={ e => filterList('areaGroupId', e.target.value) }>
                            {
                                areaGroupFilterOptions.map(option => {
                                    return <option key={ option[1] } value={ option[1] }>{ option[0] }</option>;
                                })
                            }
                        </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <select style={{ marginRight: '1rem' }} value={ filterSettings.city } onChange={ e => filterList('city', e.target.value) }>
                            {
                                cityFilterOptions.map(option => {
                                    return <option key={ option[1] } value={ option[1] }>{ option[0] }</option>;
                                })
                            }
                        </select>
                        <select value={ filterSettings.leadStatusId } onChange={ e => filterList('leadStatusId', e.target.value) }>
                            {
                                leadStatusFilterOptions.map(option => {
                                    return <option key={ option[1] } value={ option[1] }>{ option[0] }</option>;
                                })
                            }
                        </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <select style={{ marginRight: '1rem' }} value={ filterSettings.userId } onChange={ e => filterList('userId', e.target.value) }>
                            {
                                userFilterOptions.map(option => {
                                    return <option key={ option[1] } value={ option[1] }>{ option[0] }</option>;
                                })
                            }
                        </select>
                        <select value={ filterSettings.teamId } onChange={ e => filterList('teamId', e.target.value) }>
                            {
                                teamFilterOptions.map(option => {
                                    return <option key={ option[1] } value={ option[1] }>{ option[0] }</option>;
                                })
                            }
                        </select>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            
                            <th>
                                <div onClick={ () => sortList('firstName') } className="sort-control">
                                    Name <i className={
                                        sortSettings.column === 'firstName'
                                            ? (sortSettings.ascending ? 'fas fa-caret-down' : 'fas fa-caret-up')
                                            : 'fas fa-sort'
                                    }></i>
                                </div>
                            </th>
                            <th>
                                <div onClick={ () => sortList('city') } className="sort-control">
                                    Address <i className={
                                        sortSettings.column === 'city'
                                            ? (sortSettings.ascending ? 'fas fa-caret-down' : 'fas fa-caret-up')
                                            : 'fas fa-sort'
                                    }></i>
                                </div>
                            </th>
                            <th>
                                <div onClick={ () => sortList('leadStatusTitle') } className="sort-control">
                                    Status <i className={
                                        sortSettings.column === 'leadStatusTitle'
                                            ? (sortSettings.ascending ? 'fas fa-caret-down' : 'fas fa-caret-up')
                                            : 'fas fa-sort'
                                    }></i>
                                </div>
                            </th>
                            <th>
                                <div onClick={ () => sortList('userId') } className="sort-control">
                                    Assigned User <i className={
                                        sortSettings.column === 'userId'
                                            ? (sortSettings.ascending ? 'fas fa-caret-down' : 'fas fa-caret-up')
                                            : 'fas fa-sort'
                                    }></i>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderLeads() }
                    </tbody>
                </table>
                <div className="button-group">
                    <div className="toggle">
                        <label>Toggle Inactive</label>
                        <span onClick={ toggleActive }>
                            <i className={ !activeShown ? 'fas fa-toggle-on' : 'fas fa-toggle-off' }></i>
                        </span>
                    </div>
                    <p style={{ marginTop: '1rem' }}>Leads Shown: { leadsCount }</p>
                </div>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    leads: state.leads.leads,
    isReadOnly: state.auth.isReadOnly
});


export default connect(mapStateToProps, { fetchLeads })(LeadsIndex);