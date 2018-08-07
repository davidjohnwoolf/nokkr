import React from 'react';
import { connect } from 'react-redux';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

import { fetchLeadStatuses } from '../../actions/lead-statuses.action';

import LeadStatusNew from '../lead-statuses/lead-status-new';

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
        this.toggleProp = this.toggleProp.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchLeadStatuses();
    }
    
    componentDidUpdate(prevProps) {
        const {
            props: { leadStatuses },
            state: { isLoading }
        } = this;
        
        if (leadStatuses && isLoading) {
            const sortedStatuses = [...leadStatuses];
            const orderOptions = [['Select Order', '']];
            
            sortedStatuses.sort((a, b) => a.order - b.order);
            
            sortedStatuses.forEach(leadStatus => orderOptions.push(leadStatus.order));
            
            orderOptions.push(orderOptions[orderOptions.length - 1] + 1);
            
            this.setState({ isLoading: false, sortedStatuses, orderOptions });
            
            console.log(this.state.orderOptions)
        }
        
        if (!isLoading && (prevProps.leadStatuses !== this.props.leadStatuses)) {
            const sortedStatuses = [...leadStatuses];
            const orderOptions = [['Select Order', '']];
            
            sortedStatuses.sort((a, b) => a.order - b.order);
            
            sortedStatuses.forEach(leadStatus => orderOptions.push(leadStatus.order));
            
            orderOptions.push(orderOptions[orderOptions.length - 1] + 1);
            
            this.setState({ sortedStatuses, orderOptions });
        }
    }
    
    setEditable(id) {
        this.setState({ editableStatusId: id });
    }
	
    renderLeadStatuses() {
        const { state: { sortedStatuses, editableStatusId }, setEditable } = this;
        
        return (
            sortedStatuses.map(leadStatus => {
                if (editableStatusId === leadStatus._id) {
                    return (
                        <tr key={ leadStatus._id }>
                            <td>
                                <i className="fas fa-caret-up"></i>
                                <i className="fas fa-caret-down"></i>
                            </td>
                            <td>
                                <i style={{ color: leadStatus.color }} className="fas fa-home"></i>
                                <input type="text" value={ leadStatus.title } />
                            </td>
                            <td>
                                <select value={ leadStatus.type }>
                                    <option>{ leadStatus.type }</option>
                                </select>
                            </td>
                            <td>
                                <i onClick={ () => console.log('cancel') } className="fas fa-times"></i>
                                <i onClick={ () => console.log('save') } className="fas fa-check"></i>
                            </td>
                        </tr>
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
            <main id="user-index" className="content">
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