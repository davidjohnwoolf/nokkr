import React from 'react';
import { connect } from 'react-redux';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

import { fetchLeadStatuses } from '../../actions/lead-statuses.action';

import LeadStatusNew from '../lead-statuses/lead-status-new';
import LeadStatusEdit from '../lead-statuses/lead-status-edit';

import Modal from '../layout/modal';
import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';

class LeadStatusIndex extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: true,
            newModalShown: false,
            orderOptions: null,
            sortedStatuses: null,
            editableStatusId: undefined
        };
        
        this.renderLeadStatuses = this.renderLeadStatuses.bind(this);
        this.setEditable = this.setEditable.bind(this);
        this.resetEditable = this.resetEditable.bind(this);
        this.toggleProp = this.toggleProp.bind(this);
        this.decreaseStatusOrder = this.decreaseStatusOrder.bind(this);
        this.increaseStatusOrder = this.increaseStatusOrder.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchLeadStatuses();
    }
    
    componentDidUpdate(prevProps, prevState) {
        const {
            props: { leadStatuses },
            state: { isLoading }
        } = this;
        
        if (leadStatuses && isLoading) {
            const sortedStatuses = [];
            
            const orderOptions = [['Select Order', '']];
            
            leadStatuses.forEach(status => {
                sortedStatuses.push(Object.create(status));
            });
            
            sortedStatuses.sort((a, b) => a.order - b.order);
            
            sortedStatuses.forEach(leadStatus => orderOptions.push(leadStatus.order));
            
            orderOptions.push(orderOptions[orderOptions.length - 1] + 1);
            
            this.setState({ isLoading: false, sortedStatuses, orderOptions });
        }
        
        if (!isLoading && (prevProps.leadStatuses !== this.props.leadStatuses)) {
            const sortedStatuses = [];
            const orderOptions = [['Select Order', '']];
            
            leadStatuses.forEach(status => {
                sortedStatuses.push(Object.create(status));
            });
            
            sortedStatuses.sort((a, b) => a.order - b.order);
            
            if (sortedStatuses.length) {
                sortedStatuses.forEach(status => orderOptions.push(status.order));
                orderOptions.push(orderOptions[orderOptions.length - 1] + 1);
            } else { orderOptions.push(1) }
            
            this.setState({ sortedStatuses, orderOptions });
        }
    }
    
    setEditable(id) {
        this.setState({ editableStatusId: id });
    }
    
    resetEditable() {
        //reset order
        const sortedStatuses = [];
        
        this.props.leadStatuses.forEach(status => {
            sortedStatuses.push(Object.create(status));
        });
        
        sortedStatuses.sort((a, b) => a.order - b.order);
        
        this.setState({ editableStatusId: undefined, sortedStatuses });
    }
    
    decreaseStatusOrder(id) {
        const tempStatuses = [...this.state.sortedStatuses];
        
        const statusOrder = tempStatuses.find(status => status._id === id).order;
        
        tempStatuses.forEach(status => {
            if (status._id === id) {
                status.order = status.order - 1;
            } else if (status.order === statusOrder - 1) {
                status.order = status.order + 1;
            }
        });
        
        tempStatuses.sort((a, b) => a.order - b.order);
        
        this.setState({ sortedStatuses: tempStatuses });
    }
    
    increaseStatusOrder(id) {
        const tempStatuses = [...this.state.sortedStatuses];
        
        const statusOrder = tempStatuses.find(status => status._id === id).order;
        
        tempStatuses.forEach(status => {
            if (status._id === id) {
                status.order = status.order + 1;
            } else if (status.order === statusOrder + 1) {
                status.order = status.order - 1;
            }
        });
        
        tempStatuses.sort((a, b) => a.order - b.order);
        
        this.setState({ sortedStatuses: tempStatuses });
    }
	
    renderLeadStatuses() {
        const {
            state: { sortedStatuses, editableStatusId, orderOptions },
            setEditable, resetEditable, decreaseStatusOrder, increaseStatusOrder
        } = this;
        
        return (
            sortedStatuses.map(leadStatus => {
                if (editableStatusId === leadStatus._id) {
                    return (
                        <LeadStatusEdit
                            key={ leadStatus._id }
                            decreaseStatusOrder={ decreaseStatusOrder }
                            increaseStatusOrder={ increaseStatusOrder }
                            close={ resetEditable }
                            leadStatus={ leadStatus }
                            sortedStatuses={ sortedStatuses }
                            orderOptions={ orderOptions }
                        />
                    );
                } else {
                    return (
                        <tr key={ leadStatus._id }>
                            <td>
                                <i style={{ color: leadStatus.color }} className="fas fa-home"></i>
                            </td>
                            <td>
                                { leadStatus.title }
                            </td>
                            <td>
                                { leadStatus.type }
                            </td>
                            <td onClick={ () => setEditable(leadStatus._id) }>
                                <i className="fas fa-edit"></i>
                            </td>
                        </tr>
                    );
                }
            })
        );
    }
    
    toggleProp(prop) {
        return () => this.setState({ [prop]: !this.state[prop] });
    }
    
    render() {
        const {
            props: { isReadOnly, history },
            state: { isLoading, orderOptions, sortedStatuses },
            renderLeadStatuses
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="lead-status-index" className="content">
                <ContentHeader title="Lead Status Management" history={ history } chilrenAccess={ !isReadOnly }>
                    <IconLink clickEvent={ this.toggleProp('newModalShown') } type="success" icon="plus" />
                </ContentHeader>
                <table className="table">
                    <tbody>
                        { renderLeadStatuses() }
                    </tbody>
                </table>
                <Modal
                    close={ this.toggleProp('newModalShown') }
                    shown={ this.state.newModalShown }
                    title="Create Lead Status"
                >
                    <LeadStatusNew
                        close={ this.toggleProp('newModalShown') }
                        sortedStatuses={ sortedStatuses }
                        orderOptions={ orderOptions }
                    />
                </Modal>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    leadStatuses: state.leadStatuses.leadStatuses,
    isReadOnly: state.auth.isReadOnly
});


export default connect(mapStateToProps, { fetchLeadStatuses })(LeadStatusIndex);