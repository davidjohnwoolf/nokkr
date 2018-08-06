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
            newModalShown: false
        };
        
        this.renderLeadStatuses = this.renderLeadStatuses.bind(this);
        this.toggleProp = this.toggleProp.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchLeadStatuses();
    }
    
    componentDidUpdate() {
        const {
            props: { leadStatuses },
            state: { isLoading }
        } = this;
        
        if (leadStatuses && isLoading) this.setState({ isLoading: false });
    }
	
    renderLeadStatuses() {
        const { leadStatuses } = this.props;
        
        return (
            leadStatuses.map(leadStatus => {
                return (
                    //I think you need to create a doc for the db to add ids since you manually entered them
                    <tr key={ leadStatus._id }>
                        <td>
                            <i className="fas fa-sort"></i>
                        </td>
                        <td>
                            <i style={{ color: leadStatus.color }} className="fas fa-home"></i>
                        </td>
                        <td>
                            { leadStatus.title }
                        </td>
                        <td>
                            { leadStatus.type }
                        </td>
                    </tr>
                );
            })
        );
    }
    
    toggleProp(prop) {
        return () => this.setState({ [prop]: !this.state[prop] });
    }
    
    render() {
        const {
            props: { isReadOnly, history },
            state: { isLoading },
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
                    <LeadStatusNew close={ this.toggleProp('newModalShown') } />
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