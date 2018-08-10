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
            sortSettings: {
                column: undefined,
                ascending: true
            }
        };
        
        this.toggleNoSales = this.toggleNoSales.bind(this);
        this.sortList = this.sortList.bind(this);
        this.renderLeads = this.renderLeads.bind(this);
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
            
            const filteredList = leads.filter(lead => {
                return lead.leadStatusType !== 'No Sale';
            });
            
            this.setState({ isLoading: false, leadsCount: leads.length, itemList: filteredList });
        }
        
        //update user list on active user toggle
        if (!isLoading && prevState.activeShown !== activeShown) {
            
            const filteredList = leads.filter(lead => {
                if (activeShown) return lead.leadStatusType !== 'No Sale';
                if (!activeShown) return lead.leadStatusType === 'No Sale';
            });
            
            console.log(filteredList)
            
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
            state: { isLoading, activeShown, leadsCount, sortSettings },
            toggleNoSales,
            renderLeads,
            sortList
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="user-index" className="content">
                <ContentHeader title="Lead Management" history={ history } chilrenAccess={ !isReadOnly }>
                    <IconLink url="/leads/new" type="success" icon="plus" />
                </ContentHeader>
                <input type="text" placeholder="search leads" />
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