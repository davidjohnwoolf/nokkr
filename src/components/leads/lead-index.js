import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';
import { sortItems } from '../helpers/list';

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
            filterSettings: {
                areaId: undefined,
                areaGroupId: undefined,
                city: undefined,
                leadStatus: undefined,
                userId: undefined,
                teamId: undefined
            },
            leadStatusFilterOptions: null,
            sortSettings: {
                column: undefined,
                ascending: true
            }
        };
        
        this.toggleNoSales = this.toggleNoSales.bind(this);
        this.sortList = this.sortList.bind(this);
        this.renderLeads = this.renderLeads.bind(this);
        this.filterList = this.filterList.bind(this);
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
            
            const leadStatusFilterOptions = [['Filter by Status', '']];
            const statusDupeCheck = [];
            
            leads.forEach(lead => {
               if (!statusDupeCheck.includes(lead.leadStatus)) {
                   statusDupeCheck.push(lead.leadStatus)
                   leadStatusFilterOptions.push([lead.leadStatusTitle, lead.leadStatus]);
               }
            });
            
            const filteredList = leads.filter(lead => {
                return lead.leadStatusType !== 'No Sale';
            });
            
            this.setState({ isLoading: false, leadsCount: leads.length, itemList: filteredList, leadStatusFilterOptions });
        }
        
        //update user list on active user toggle
        if (!isLoading && prevState.activeShown !== activeShown) {
            const filterSettings = { ...this.state.filterSettings };
        
            const filteredList = this.props.leads.filter(lead => {
                let notFiltered = true;
                
                for (let setting in filterSettings) {
                    if (filterSettings[setting]) {
                        if (lead[setting] !== filterSettings[setting]) notFiltered = false;
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
    
    toggleNoSales() {
        this.setState({ activeShown: !this.state.activeShown});
    }
    
    filterList(prop, value) {
        const filterSettings = { ...this.state.filterSettings };
        
        filterSettings[prop] = value;
        
        const filteredList = this.props.leads.filter(lead => {
            let notFiltered = true;
            
            for (let setting in filterSettings) {
                if (filterSettings[setting]) {
                    if (lead[setting] !== filterSettings[setting]) notFiltered = false;
                }
            }
            
            if (this.state.activeShown) return (lead.leadStatusType !== 'No Sale') && notFiltered;
            if (!this.state.activeShown) return (lead.leadStatusType === 'No Sale') && notFiltered;
        });
        
        this.setState({ itemList: filteredList, filterSettings });
    }
    
    sortList(col) {
        const { sortSettings: { column, ascending } } = this.state;
        
        col === column
            ? this.setState({ sortSettings: { column, ascending: !ascending } })
            : this.setState({ sortSettings: { column: col, ascending: true } });
    }
	
    renderLeads() {
        const { itemList } = this.state;
        
        return (
            itemList.map(lead => {

                return (
                    <tr key={ lead._id }>
                        <td>
                            <Link to={ `/leads/${ lead._id }` }>{ `${ lead.firstName } ${ lead.lastName }` }</Link>
                        </td>
                        <td>
                            { `${ lead.address } ${ lead.city }, ${ lead.state }` }
                        </td>
                        <td>
                            { lead.leadStatusTitle }
                        </td>
                    </tr>
                );
            })
        );
    }
    
    render() {
        const {
            props: { isReadOnly, history },
            state: { isLoading, activeShown, leadsCount, sortSettings, leadStatusFilterOptions, filterSettings },
            toggleNoSales, renderLeads, sortList, filterList
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="user-index" className="content">
                <ContentHeader title="Lead Management" history={ history } chilrenAccess={ !isReadOnly }>
                    <IconLink onClick={ () => console.log('search') } type="primary" icon="cog" />
                </ContentHeader>
                <input type="text" placeholder="search leads" />
                <h4>Show Filters <i className="fas fa-caret-down"></i></h4>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <select style={{ marginRight: '1rem' }}>
                        <option>Filter by Area</option>
                    </select>
                    <select>
                        <option>Filter by Area Group</option>
                    </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <select style={{ marginRight: '1rem' }}>
                        <option>Filter by City</option>
                    </select>
                    <select value={ filterSettings.leadStatusFilter } onChange={ e => filterList('leadStatus', e.target.value) }>
                        {
                            leadStatusFilterOptions.map(option => {
                                return <option key={ option[1] } value={ option[1] }>{ option[0] }</option>
                            })
                        }
                    </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <select style={{ marginRight: '1rem' }}>
                        <option>Filter by User</option>
                    </select>
                    <select>
                        <option>Filter by Team</option>
                    </select>
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
                        </tr>
                    </thead>
                    <tbody>
                        { renderLeads() }
                    </tbody>
                </table>
                <div className="button-group">
                    <div className="toggle">
                        <label>Toggle No Sales</label>
                        <span onClick={ toggleNoSales }>
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