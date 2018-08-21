import React from 'react';
import { connect } from 'react-redux';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

import { fetchLeadFields } from '../../actions/lead-fields.action';

import LeadFieldNew from '../lead-fields/lead-field-new';
import LeadFieldEdit from '../lead-fields/lead-field-edit';

import Modal from '../layout/modal';
import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';

class LeadFieldIndex extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: true,
            newFormShown: false,
            orderOptions: null,
            sortedFields: null,
            editableFieldId: undefined
        };
        
        this.renderLeadFields = this.renderLeadFields.bind(this);
        this.setEditable = this.setEditable.bind(this);
        this.resetEditable = this.resetEditable.bind(this);
        this.toggleProp = this.toggleProp.bind(this);
        this.decreaseFieldOrder = this.decreaseFieldOrder.bind(this);
        this.increaseFieldOrder = this.increaseFieldOrder.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchLeadFields();
    }
    
    componentDidUpdate(prevProps) {
        const {
            props: { leadFields },
            state: { isLoading }
        } = this;
        
        if (leadFields && isLoading) {
            const sortedFields = [];
            
            const orderOptions = [['Select Order', '']];
            
            leadFields.forEach(field => {
                sortedFields.push(Object.create(field));
            });
            
            sortedFields.sort((a, b) => a.order - b.order);
            
            if (sortedFields.length) {
                sortedFields.forEach(field => orderOptions.push(field.order));
                orderOptions.push(orderOptions[orderOptions.length - 1] + 1);
            } else { orderOptions.push(1) }
            
            this.setState({ isLoading: false, sortedFields, orderOptions });
        }
        
        if (!isLoading && (prevProps.leadFields !== this.props.leadFields)) {
            const sortedFields = [];
            const orderOptions = [['Select Order', '']];
            
            leadFields.forEach(field => {
                sortedFields.push(Object.create(field));
            });
            
            sortedFields.sort((a, b) => a.order - b.order);
            
            sortedFields.forEach(field => orderOptions.push(field.order));
            
            orderOptions.push(orderOptions[orderOptions.length - 1] + 1);
            
            this.setState({ sortedFields, orderOptions });
        }
    }
    
    setEditable(id) {
        this.setState({ editableFieldId: id });
    }
    
    resetEditable() {
        //reset order
        const sortedFields = [];
        
        this.props.leadFields.forEach(field => {
            sortedFields.push(Object.create(field));
        });
        
        sortedFields.sort((a, b) => a.order - b.order);
        
        this.setState({ editableFieldId: undefined, sortedFields });
    }
    
    decreaseFieldOrder(id) {
        const tempFields = [...this.state.sortedFields];
        
        const fieldOrder = tempFields.find(status => status._id === id).order;
        
        tempFields.forEach(field => {
            if (field._id === id) {
                field.order = field.order - 1;
            } else if (field.order === fieldOrder - 1) {
                field.order = field.order + 1;
            }
        });
        
        tempFields.sort((a, b) => a.order - b.order);
        
        this.setState({ sortedFields: tempFields });
    }
    
    increaseFieldOrder(id) {
        const tempFields = [...this.state.sortedFields];
        
        const fieldOrder = tempFields.find(status => status._id === id).order;
        
        tempFields.forEach(field => {
            if (field._id === id) {
                field.order = field.order + 1;
            } else if (field.order === fieldOrder + 1) {
                field.order = field.order - 1;
            }
        });
        
        tempFields.sort((a, b) => a.order - b.order);
        
        this.setState({ sortedFields: tempFields });
    }
	
    renderLeadFields() {
        const {
            state: { sortedFields, editableFieldId, orderOptions },
            setEditable, resetEditable, decreaseFieldOrder, increaseFieldOrder
        } = this;
        
        return (
            sortedFields.map(field => {
                if (editableFieldId === field._id) {
                    return (
                        <LeadFieldEdit
                            key={ field._id }
                            decreaseFieldOrder={ decreaseFieldOrder }
                            increaseFieldOrder={ increaseFieldOrder }
                            close={ resetEditable }
                            leadField={ field }
                            sortedFields={ sortedFields }
                            orderOptions={ orderOptions }
                        />
                    );
                } else {
                    return (
                        <tr key={ field._id }>
                            <td>
                                { field.isActive ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i> }
                            </td>
                            <td>
                                { field.label }
                            </td>
                            <td>
                                { field.type }
                            </td>
                            <td onClick={ () => setEditable(field._id) }>
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
            state: { isLoading, orderOptions, sortedFields },
            renderLeadFields
        } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="user-index" className="content">
                <ContentHeader title="Lead Field Management" history={ history } chilrenAccess={ !isReadOnly }>
                    <IconLink clickEvent={ this.toggleProp('newFormShown') } type="success" icon="plus" />
                </ContentHeader>
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                Active
                            </th>
                            <th>
                                Label
                            </th>
                            <th>
                                Type
                            </th>
                            <th>
                                Edit
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderLeadFields() }
                        { this.state.newFormShown
                            ? (
                                <LeadFieldNew
                                    close={ this.toggleProp('newFormShown') }
                                    sortedFields={ sortedFields }
                                    orderOptions={ orderOptions }
                                />
                            ) : undefined
                        }
                    </tbody>
                </table>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    leadFields: state.leadFields.leadFields,
    isReadOnly: state.auth.isReadOnly
});


export default connect(mapStateToProps, { fetchLeadFields })(LeadFieldIndex);