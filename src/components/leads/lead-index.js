import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { SU, ADMIN, MANAGER, USER, LEAD_PATH } from '../../../lib/constants';
import { sortItems, searchItems } from '../helpers/list';

import { fetchLeads, clearLeads, bulkLeadStatusUpdate } from '../../actions/leads.action';
import { sendMessage } from '../../actions/flash.action';

import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';
import Modal from '../layout/modal';

class LeadsIndex extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: true,
            activeShown: true,
            itemsShown: [],
            items: [],
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
            settingsModalShown: false,
            selectAllActive: false,
            searchResults: null,
            columnSettingsModalShown: false,
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
        this.selectAllItems = this.selectAllItems.bind(this);
        this.selectItem = this.selectItem.bind(this);
        this.bulkUpdate = this.bulkUpdate.bind(this);
        this.bulkUpdateConfig = this.bulkUpdateConfig.bind(this);
        this.downloadCSV = this.downloadCSV.bind(this);
        this.toggleProp = this.toggleProp.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchLeads();
    }
    
    componentDidUpdate(prevProps, prevState) {
        const {
            props: { success, updated, message, clearLeads, fetchLeads },
            state: {
                isLoading,
                activeShown,
                itemsShown, 
                sortSettings
            }
        } = this;
        
        //initialize
        if (this.props.leads && isLoading) {

            const items = this.props.leads.map(lead => {
                let newItem = Object.create(lead);
                newItem.selected = false;
                return newItem;
            });
            
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

            items.forEach(lead => {
                
                buildOptionsFromList(lead, leadStatusFilterOptions, 'leadStatusTitle', 'leadStatusId');
                buildOptionsFromList(lead, cityFilterOptions, 'city', 'city');
                buildOptionsFromList(lead, userFilterOptions, 'assignedUserName', 'userId');
                buildOptionsFromList(lead, teamFilterOptions, 'teamTitle', 'teamId');
                buildOptionsFromList(lead, areaFilterOptions, 'areaTitle', 'areaId');
                buildOptionsFromList(lead, areaGroupFilterOptions, 'areaGroupTitle', 'areaGroupId');

            });
            
            const filteredList = items.filter(lead => lead.leadStatusType !== 'No Sale');
            
            this.setState({
                isLoading: false,
                items: items,
                leadsCount: filteredList.length,
                itemsShown: filteredList,
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
            
            const filteredList = this.state.items.filter(lead => {
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
            
            this.setState({ itemsShown: sortItems(filteredList, sortSettings), leadsCount: filteredList.length, selectAllActive: false });
        }
        
        //update user list on sort
        if (!isLoading && prevState.sortSettings !== sortSettings) {
            this.setState({ itemsShown: sortItems(itemsShown, sortSettings) });
        }
        
        if (success && updated) {
            sendMessage(message);
            clearLeads();
            fetchLeads();
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
        
        const filteredList = this.state.items.filter(lead => {
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
        
        this.setState({ itemsShown: sortItems(filteredList, this.state.sortSettings), filterSettings, leadsCount: filteredList.length, activeShown, selectAllActive: false });
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
        
        this.setState({ searchResults: searchItems(this.state.items, this.state.searchQuery) });
    }
    
    clearResults() {
        this.setState({ searchResults: null, searchQuery: '' });
    }
	
    renderLeads() {
        const { itemsShown } = this.state;
        
        return (
            itemsShown.map(lead => {

                return (
                    <tr key={ lead._id }>
                        <td>
                            <div className="sort-control">
                                <input type="checkbox" checked={ lead.selected } onChange={ e => this.selectItem(e, lead._id) } />
                            </div>
                        </td>
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
    
    selectItem(event, id) {
        const itemsShown = this.state.itemsShown.map(item => Object.create(item));
        const selectAllActive = event.target.checked ? this.state.selectAllActive : false;
        
        event.target.checked
            ? itemsShown.find(item => item._id === id).selected = true
            : itemsShown.find(item => item._id === id).selected = false;
        
        this.setState({ itemsShown, selectAllActive });
        
    }
    
    selectAllItems(event) {
        const itemsShown = this.state.itemsShown.map(item => Object.create(item));
        const selectAllActive = event.target.checked ? true : false;
        
        event.target.checked
            ? itemsShown.forEach(item => item.selected = true)
            : itemsShown.forEach(item => item.selected = false)
        
        this.setState({ itemsShown, selectAllActive });
    }
    
    bulkUpdate(type) {
        /*const leadIds = [];
        
        this.state.itemsShown.forEach(lead => {
            if (lead.selected) {
                leadIds.push(lead._id);
            }
        });
        
        if (event.target.value === 'status') {
            console.log(leadIds)
            this.props.bulkLeadStatusUpdate(leadIds, '5b687c62b8c07a1d37b7a40a');
        }*/
        console.log('bulk update' + type)
    }
    
    bulkUpdateConfig(event) {
        console.log('bulk update' + event.target.value)
    }
    
    downloadCSV() {
        function convertArrayOfObjectsToCSV(data) {  
            let result, ctr, keys, columnDelimiter, lineDelimiter;
        
            columnDelimiter = data.columnDelimiter || ',';
            lineDelimiter = data.lineDelimiter || '\n';
        
            keys = Object.keys(data[0]);
        
            result = '';
            result += keys.join(columnDelimiter);
            result += lineDelimiter;
        
            data.forEach(function(item) {
                ctr = 0;
                keys.forEach(function(key) {
                    if (ctr > 0) result += columnDelimiter;
        
                    result += item[key];
                    ctr++;
                });
                result += lineDelimiter;
            });
        
            return result;
        }
        
        let data = [];
        
        this.state.itemsShown.forEach(item => {
            if (item.selected) {
                data.push(this.props.leads.find(lead => item._id === lead._id));
            }
        })
        
        if (!data.length) {
            alert('No leads selected');
        } else {
            //window.open('data:text/csv;charset=utf-8,' + convertArrayOfObjectsToCSV(data), 'leads-' + Date.now + '.csv');
            
            let uri = 'data:text/csv;charset=utf-8,' + convertArrayOfObjectsToCSV(data);
            let currentDate = new Date();
            let downloadLink = document.createElement('a');
            downloadLink.href = uri;
            downloadLink.download = `leads_${ currentDate.getMonth() }-${ currentDate.getDate() }-${ currentDate.getFullYear() }.csv`;
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    }
    
    toggleProp(prop) {
        return () => this.setState({ [prop]: !this.state[prop] });
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
                    <IconLink clickEvent={ this.toggleProp('settingsModalShown') } icon="cog" />
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
                <div className="button-group">
                    <a style={{ display: 'inline-block', margin: '1rem 0', cursor: 'pointer' }} onClick={ toggleFilters }>
                        Show Filters <i className={ filtersShown ? 'fas fa-caret-up' : 'fas fa-caret-down' }></i>
                    </a>
                    <a style={{ display: 'inline-block', margin: '1rem 0', cursor: 'pointer' }} onClick={ this.toggleProp('columnSettingsModalShown') }>
                        Column Settings <i className="fas fa-caret-right"></i>
                    </a>
                </div>
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
                                <div className="sort-control">
                                    <input type="checkbox" checked={ this.state.selectAllActive } onChange={ e => this.selectAllItems(e) } />
                                </div>
                            </th>
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
                <Modal close={ this.toggleProp('settingsModalShown') } shown={ this.state.settingsModalShown } title="Lead Settings">

                    <section className="lead-settings">
                        <button onClick={ this.downloadCSV }>Export Selected as CSV</button>
                        
                        <h4>Bulk Actions</h4>
                        <select onChange={ e => this.bulkUpdateConfig(e) }>
                            <option>Select action</option>
                            <option value="reassignUser">Reassign selected leads</option>
                            <option value="updateStatus">Changed selected leads statuses</option>
                            <option value="delete">Delete selected leads</option>
                        </select>
                    </section>
                </Modal>
                <Modal close={ this.toggleProp('columnSettingsModalShown') } shown={ this.state.columnSettingsModalShown } title="Column Settings">

                    <section className="column-settings">
                        <p>settings</p>
                    </section>
                </Modal>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    leads: state.leads.leads,
    success: state.leads.success,
    updated: state.leads.updated,
    isReadOnly: state.auth.isReadOnly
});


export default connect(mapStateToProps, { fetchLeads, bulkLeadStatusUpdate, clearLeads })(LeadsIndex);