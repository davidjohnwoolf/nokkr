import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

import { fetchLeadStatuses } from '../../actions/lead-statuses.action';

import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';

class LeadStatusIndex extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: true
        };
        
        this.renderLeadStatuses = this.renderLeadStatuses.bind(this);
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
                    <tr key={ leadStatus._id }>
                        <td>
                            <i className="fas fa-sort"></i>
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
    
    render() {
        const {
            props: { isReadOnly, history },
            state: { isLoading },
            renderLeadStatuses
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="user-index" className="content">
                <ContentHeader title="User Management" history={ history } chilrenAccess={ !isReadOnly }>
                    <IconLink url="/lead-statuses/new" type="success" icon="plus" />
                </ContentHeader>
                <table className="table">
                    <tbody>
                        { renderLeadStatuses() }
                    </tbody>
                </table>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    leadStatuses: state.leadStatuses.leadStatuses,
    isReadOnly: state.auth.isReadOnly
});


export default connect(mapStateToProps, { fetchLeadStatuses })(LeadStatusIndex);