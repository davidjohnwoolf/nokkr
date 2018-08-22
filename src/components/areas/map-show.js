import React from 'react';

import { getBounds, createMap, setArea, setPosition, setLeads, locationError } from '../helpers/maps';
import { AREA_PATH } from '../../../lib/constants';

import Modal from '../layout/modal';

import LeadNew from '../leads/lead-new';
import LeadEdit from '../leads/lead-edit';

//can you write your own react style listeners for maps?

class MapShow extends React.Component {
    
	constructor(props) {
        super(props);
        
        this.constants = Object.freeze({
            SETTINGS_MODAL_SHOWN: 'settingsModalShown',
            LEAD_MODAL_SHOWN: 'leadModalShown',
            OVERLAY_SHOWN: 'overlayShown',
        });
        
        this.state = {
            locationActive: false,
            geocoder: null,
            settingsModalShown: false,
            leadModalShown: false,
            overlayShown: true,
            isInitialized: false,
            settingPosition: false,
            positionMarker: null,
            newLeadMarker: null,
            newLeadAddress: undefined,
            newLeadCity: undefined,
            newLeadState: undefined,
            newLeadZipcode: undefined,
            newLeadLatLng: null,
            leadMarkers: null,
            leadOptionsLead: null,
            editLeadModalShown: false,
            leadOverviewShown: false,
            map: null,
            areaPolygon: null,
            outerPolygon: null
        };
        
        
        this.toggleProp = this.toggleProp.bind(this);
        this.goToArea = this.goToArea.bind(this);
        this.setLocation = this.setLocation.bind(this);
        this.showLeadOverview = this.showLeadOverview.bind(this);
        this.hideLeadOptions = this.hideLeadOptions.bind(this);
        this.showEditLeadForm = this.showEditLeadForm.bind(this);
        
        //build get bounds function
        window.google.maps.Polygon.prototype.getBounds = getBounds(window.google.maps);
    }
    
    componentDidMount() {
        //component must be mounted to reference the map element
        this.setState({ map: createMap(window.google.maps), geocoder: new window.google.maps.Geocoder });
    }
    
    componentDidUpdate(prevProps, prevState) {
        const {
            props: { areas, leads, id },
            state: { map, overlayShown, isInitialized },
            constants: { LEAD_MODAL_SHOWN },
            showLeadOverview
        } = this;
        
        if (!isInitialized) {
            
            this.state.map.addListener('click', e => {
                this.state.geocoder.geocode({ 'location': e.latLng }, (results, status) => {
                    if (status === 'OK') {
                        if (results[0]) {
                            let marker = new window.google.maps.Marker({
                                position: e.latLng,
                                map: map
                            });
                            
                            let streetNumber;
                            let street;
                            let city;
                            let state;
                            let zipcode;
                            
                            results[0].address_components.forEach(component => {
                                if (component.types.includes('street_number')) streetNumber = component.short_name || component.long_name;
                                if (component.types.includes('route')) street = component.short_name || component.long_name;
                                if (component.types.includes('locality')) city = component.short_name || component.long_name;
                                if (component.types.includes('administrative_area_level_1')) state = component.short_name || component.long_name;
                                if (component.types.includes('postal_code')) zipcode = component.short_name || component.long_name;
                            });
                            
                            this.setState({
                                newLeadMarker: marker,
                                newLeadAddress: streetNumber && street ? streetNumber + ' ' + street : '',
                                newLeadCity: city || '',
                                newLeadState: state || '',
                                newLeadZipcode: zipcode || '',
                                newLeadLatLng: e.latLng,
                                leadModalShown: true
                            });
                            
                        } else {
                            window.alert('No results found');
                        }
                    } else {
                        window.alert('Geocoder failed due to: ' + status);
                    }
                });
            });
            
            this.setState({ isInitialized: true, ...setArea({ googleMaps: window.google.maps, map, id, areas }), ...setLeads({ leads, map, showLeadOverview }) });
        }
        
        if (prevProps.id !== this.props.id) {
            //clear current overlay
            this.state.outerPolygon.setMap(null);
            
            this.setState(setArea({ googleMaps: window.google.maps, map, id, areas }));
        }
        
        if (prevProps.leads !== this.props.leads) {
            this.setState(setLeads({ leads, map, showLeadOverview }));
        }
        
        if (prevState.leadModalShown !== this.state.leadModalShown) {
            if (!this.state.leadModalShown) {
                this.state.newLeadMarker.setMap(null);
                this.setState({ newLeadMarker: null });
            }
        }
        
        if (prevState.overlayShown !== overlayShown) {
            overlayShown
                ? this.state.outerPolygon.setOptions({ fillOpacity: .5 })
                : this.state.outerPolygon.setOptions({ fillOpacity: 0 });
        }
    }
    
    showLeadOverview(lead) {
        this.setState({ leadOptionsLead: lead, leadOverviewShown: true });
    }
    
    showEditLeadForm() {
        this.setState({ leadOverlayShown: false, editLeadModalShown: true, leadOverviewShown: false });
    }
    
    hideLeadOptions() {
        this.setState({ leadOptionsLead: null, leadOverlayShown: false, editLeadModalShown: false });
    }
    
    setLocation() {
        const { state: { map, positionMarker, positionWatcher } } = this;
        
        const displayAndWatch = position => {
            
            //go to position
            this.state.map.panTo(new window.google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
            ));
            
            this.state.map.setZoom(19);
            
            //set and watch position
            this.setState(setPosition({ position, positionMarker, positionWatcher, map }));
        };
        
        const onMapChange = () => {
            if (this.state.locationActive && !this.state.settingPosition) {
                window.google.maps.event.clearListeners(this.state.map, 'center_changed');
                window.navigator.geolocation.clearWatch(this.state.positionWatcher);
                
                this.setState({ positionWatcher: null, locationActive: false });
            }
            
            if (this.state.locationActive && this.state.settingPosition) {
                this.setState({ settingPosition: false });
            }
        };
        
        //actual call
        if (window.navigator.geolocation) {
            
            if (!this.state.locationActive) {
                window.navigator.geolocation.getCurrentPosition(displayAndWatch, locationError);
                
                this.state.map.addListener('center_changed', onMapChange);
            }
                
        } else {
            alert('Your browser does not support the Geolocation API');
        }
    }
    
    toggleProp(prop) {
        return () => this.setState({ [prop]: !this.state[prop] });
    }
    
    goToArea(e) {
        window.google.maps.event.trigger(this.state.map, 'center_changed');
        this.props.history.push(AREA_PATH + e.target.value);
    }

    render() {
        const {
            props: { id, areas },
            state: {
                settingsModalShown,
                locationActive,
                overlayShown,
                leadModalShown,
                newLeadAddress,
                newLeadCity,
                newLeadState,
                newLeadZipcode,
                newLeadLatLng,
                leadOptionsLead,
                leadOverviewShown,
                editLeadModalShown
            },
            constants: { SETTINGS_MODAL_SHOWN, LEAD_MODAL_SHOWN, OVERLAY_SHOWN },
            setLocation, toggleProp, goToArea, hideLeadOptions, showEditLeadForm
        } = this;
        
        return (
            <div className="full-map-container">
                <div style={{ position: 'absolute', right: '1rem', zIndex: '10' }}>
                    <button style={{ marginRight: '1rem' }} onClick={ setLocation } className={ locationActive ? 'map-button success' : 'map-button cancel' }>
                        <i className="fas fa-location-arrow"></i>
                    </button>
                    <button onClick={ toggleProp(SETTINGS_MODAL_SHOWN) } className="map-button primary">
                        <i className="fas fas fa-cog"></i>
                    </button>
                </div>
                
                <div id="map" style={{ height: window.innerHeight - 58 }}></div>
                
                <Modal close={ toggleProp(SETTINGS_MODAL_SHOWN) } shown={ settingsModalShown } title="Area Settings">
                    <section className="area-settings">
                        
                        <div className="toggle" onClick={ toggleProp(OVERLAY_SHOWN) }>
                            <label>Show Overlay</label>
                            <span>
                                <i className={ overlayShown ? 'fas fa-toggle-on' : 'fas fa-toggle-off' }></i>
                            </span>
                        </div>
                        
                        <h4>Switch Area</h4>
                        <select onChange={ (e) => goToArea(e) } value={ id }>
                            { areas.map(area => {
                                return <option key={ area._id } value={ area._id }>{ area.title } ({ area.assignedUserName })</option>;
                            }) }
                        </select>
                        
                        <button onClick={ () => console.log('go to leads') } className="button primary">
                            View Leads List <i className="fas fa-users"></i>
                        </button>
                    </section>
                </Modal>
                <Modal close={ toggleProp(LEAD_MODAL_SHOWN) } shown={ leadModalShown } title="Create Lead">
                    { /* make hasAddress more intuitive and certain, leadmoModalShown may not be best */ }
                    {
                        leadModalShown
                            ? (
                                <LeadNew
                                    close={ toggleProp(LEAD_MODAL_SHOWN) }
                                    address={ newLeadAddress }
                                    city={ newLeadCity }
                                    state={ newLeadState }
                                    zipcode={ newLeadZipcode }
                                    latLng={ newLeadLatLng }
                                    hasAddress={ leadModalShown }
                                />
                            ) : ''
                    }
                </Modal>
                <Modal close={ hideLeadOptions } shown={ leadOptionsLead && editLeadModalShown ? true : false } title={ leadOptionsLead ? leadOptionsLead.firstName + ' ' + leadOptionsLead.lastName : '' }>
                    {
                        leadOptionsLead && editLeadModalShown
                            ? (
                                <LeadEdit
                                    close={ hideLeadOptions }
                                    lead={ leadOptionsLead }
                                />
                            ) : ''
                    }
                </Modal>
                {
                    leadOptionsLead && leadOverviewShown
                        ? (
                            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'fixed', bottom: '0', width: '100%', background: '#fff', padding: '10px', borderTop: '2px #999 solid' }}>
                                <h4>{ leadOptionsLead.firstName + ' ' + leadOptionsLead.lastName }</h4>
                                <p>{ leadOptionsLead.address }</p>
                                <a onClick={ showEditLeadForm } className="button primary">Show Lead</a>
                                <a onClick={ hideLeadOptions } className="icon-link cancel"><i className="fas fa-times"></i></a>
                            </div>
                        ) : ''
                }
            </div>
        );
    }
}

export default MapShow;