import React from 'react';
import { connect } from 'react-redux';

import { fetchLead, clearLeads } from '../../actions/leads.action';

import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';

//import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

class LeadShow extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.clearLeads();
        
        this.state = {
            isLoading: true
        };

        this.renderLeadFields = this.renderLeadFields.bind(this);
    }
    
    componentDidMount() {
        const { fetchLead, match } = this.props;
        
        fetchLead(match.params.id);
    }
    
    componentDidUpdate() {
        if (this.props.lead && this.state.isLoading) this.setState({ isLoading: false });
    }
    
    renderLeadFields() {
        const { lead } = this.props;
        const fields = [];
        for (let key in lead) {
            if ((key !== 'leadStatusId') && (key !== '_id') && (key !== 'areaId') && (key !== 'lat') && (key !== 'lng') && (key !== 'lng') && (key !== 'createdBy') && lead[key])
            if (key === 'customFields') {
                lead[key].forEach(customField => fields.push([customField.name, customField.type === 'checkbox' ? customField.checked : customField.value]))
            } else {
                fields.push([key, lead[key]])
            }
        }
        
        const formatLabel = name => {
            return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        }
        
        return fields.map(field => {
            return (
                <div key={ field[0] }>
                    <h4>{ formatLabel(field[0]) }</h4>
                    <p>{ field[1] }</p>
                </div>
            );
        })
    }
    
    render() {
        const {
            props: {
                lead,
                //role,
                //isReadOnly,
                leadStatuses,
                history,
                match: { params }
            },
            state: { isLoading }
        } = this;
        
        const contentAccess = true //((role === ADMIN || (role === SU) || ()) && !isReadOnly);
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="user-show" className="content">
                <ContentHeader title={ lead.firstName + ' ' + lead.lastName } history={ history } chilrenAccess={ contentAccess }>
                    <IconLink url={ `/leads/${ params.id }/edit` } icon="edit" />
                </ContentHeader>
                <section className="card">
                    <section>
                        { this.renderLeadFields() }
                    </section>
                </section>
                <h2>Appointments and Notes</h2>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    lead: state.leads.lead,
    //role: state.auth.role,
    //isReadOnly: state.auth.isReadOnly
});

export default connect(mapStateToProps, { fetchLead, clearLeads })(LeadShow);