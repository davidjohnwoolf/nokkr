import React from 'react';
import { connect } from 'react-redux';
import Field from '../helpers/field';

class AreaNew extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.tabStates = {};
        
        Object.defineProperty(this.tabStates, 'START', {
            value: 'START',
            writable: false
        });
        
        Object.defineProperty(this.tabStates, 'CREATE', {
            value: 'CREATE',
            writable: false
        });
        
        Object.defineProperty(this.tabStates, 'SAVE', {
            value: 'SAVE',
            writable: false
        });
        
        this.state = {
            activeTab: this.tabStates.START,
            fields: {},
            startAddress: '',
            startAddressValid: false,
            areaValid: false,
            formValid: false,
        };
        
        this.handleTabClick = this.handleTabClick.bind(this);
        this.handleAddressInput = this.handleAddressInput.bind(this);
    }
    
    handleTabChange(e) {
        //send updateTab action
    }
    
    handleAddressInput(e) {
        //load maps to try and get a match, once you do make next button active
    }
    
    handleInputChange(e) {
        //validate and update state
    }
    
    handleSubmit(e) {
        //call areas create action
    }
    

    render() {
        
        const { tabStates,  handleTabChange, handleAddressInput, handleSubmit } = this;
        
        const { activeTab, startAddress, startAddressValid, areaValid, formValid } = this.state;
        
        return (
                
            <main id="area-new" className="content">
                <header className="tab-header">
                    <button
                        className={ `tab ${ activeTab === tabStates.START ? 'active' : '' }` }
                        onClick={ () => handleTabChange(tabStates.START) }>
                        Start
                    </button>
                    <button
                        disabled={ !startAddressValid }
                        className={ `tab ${ activeTab === tabStates.CREATE ? 'active' : '' }` }
                        onClick={ () => handleTabChange(tabStates.CREATE) }>
                        Create
                    </button>
                    <button
                        disabled={ !areaValid }
                        className={ `tab ${ activeTab === tabStates.SAVE ? 'active' : '' }` }
                        onClick={ () => handleTabChange(tabStates.SAVE) }>
                        Save
                    </button>
                </header>
                <section className={ `tab-body ${ activeTab !== tabStates.START ? 'invisible' : '' }` }>
                    <h1>Area Creation</h1>
                    <input placeholder="enter an address to start" onClick={ handleAddressInput } value={ startAddress } />
                    <button
                        disabled={ !startAddressValid }
                        onClick={ () => handleTabChange(tabStates.CREATE) }>
                        Next
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </section>
                <section className={ `tab-body ${ activeTab !== tabStates.CREATE ? 'invisible' : '' }` }>
                    <p>Click to create area boundaries</p>
                    { /*<Map />*/ }
                    <button
                        disabled={ !areaValid }
                        onClick={ () => handleTabChange(tabStates.SAVE) }>
                        Next <i class="fas fa-arrow-right"></i>
                    </button>
                </section>
                <section className={ `tab-body ${ activeTab !== tabStates.SAVE ? 'invisible' : '' }` }>
                    <h2>Save Area</h2>
                    <form onSubmit={ handleSubmit }>
                        { /* title and hidden coords input fields */ }
                        <button disabled={ !formValid } type="submit">Finish <i class="fas fa-arrow-right"></i></button>
                    </form>
                </section>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    message: state.areas.message,
    success: state.areas.success,
    fail: state.areas.fail
});

export default connect(mapStateToProps, {  })(AreaNew);